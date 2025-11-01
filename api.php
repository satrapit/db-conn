<?php

// API Action event
function Api_Action($app)
{
	// ------------------ CONFIG ------------------
	$OTP_EXPIRY = 120; // seconds (2 min)
	$TOKEN_EXPIRE_DAYS = 30;
	$JWT_SECRET = Config("JWT.SECRET_KEY");
	$IS_DEBUG = Config("DEBUG") ?? false; // Enable debug info only in dev mode

	// ------------------ HELPERS ------------------
	$json = function ($response, $data, $status = 200) {
		return $response->withJson($data, $status);
	};

	$getBearerToken = function ($request) {
		$authHeader = $request->getHeaderLine('Authorization');
		if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
			return $matches[1];
		}
		return null;
	};

	$fail = function ($response, $msg = "خطا در انجام عملیات", $code = 400) use ($json) {
		return $json($response, ["success" => false, "message" => $msg], $code);
	};

	// --------------------- SEND OTP ---------------------
	$app->post('/send-otp', function ($request, $response, $args)
	use ($json, $fail, $OTP_EXPIRY, $IS_DEBUG) {
		$data = $request->getParsedBody();
		$phone = trim($data['phone'] ?? '');

		if (!preg_match('/^09\d{9}$/', $phone)) {
			return $fail($response, "شماره نامعتبر است", 400);
		}

		$lastOtp = ExecuteRow("SELECT * FROM `otps` WHERE `phone` = '" . AdjustSql($phone) . "' ORDER BY id DESC LIMIT 1");
		$now = time();

		if ($lastOtp) {
			$lastTime = strtotime($lastOtp['created_at']);
			$elapsed = $now - $lastTime;

			if ($elapsed < $OTP_EXPIRY && !$lastOtp['used_at']) {
				// OTP still valid, return success with remaining time
				$resp = [
					"success" => true,
					"message" => "کد مجددا ارسال شد"
				];

				if ($IS_DEBUG && isset($lastOtp['otp_code'])) {
					// In debug mode, we can't show the original OTP (it's hashed)
					// But we can indicate that the previous code is still valid
					$resp["debug_note"] = "کد قبلی هنوز معتبر است";
				}

				return $json($response, $resp);
			}
		}

		// ------------------ Generate secure OTP ------------------
		$otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
		$otpHash = password_hash($otp, PASSWORD_DEFAULT);
		ExecuteStatement("INSERT INTO `otps` (`phone`, `otp_code`, `created_at`) VALUES ('" . AdjustSql($phone) . "', '" . AdjustSql($otpHash) . "', NOW())");

		// ------------------ Debug mode ------------------
		$resp = ["success" => true, "message" => "کد ارسال شد"];
		if ($IS_DEBUG) {
			$resp["debug_otp"] = $otp;
		}

		// Real SMS (in production)
		// sendSms($phone, "کد شما: $otp");

		return $json($response, $resp);
	});

	// --------------------- VERIFY OTP ---------------------
	$app->post('/verify-otp', function ($request, $response, $args)
	use ($json, $fail, $JWT_SECRET, $TOKEN_EXPIRE_DAYS) {
		$data = $request->getParsedBody();
		$phone = trim($data['phone'] ?? '');
		$otp = trim($data['code'] ?? '');

		if (!$phone || !$otp) {
			return $fail($response, "شماره یا کد ارسال نشده است", 400);
		}

		$row = ExecuteRow("SELECT * FROM `otps` WHERE `phone` = '" . AdjustSql($phone) . "' ORDER BY id DESC LIMIT 1");
		if (!$row || $row['used_at'] || !password_verify($otp, $row['otp_code'])) {
			return $fail($response, "کد نامعتبر است", 401);
		}

		// Mark OTP as used
		ExecuteStatement("UPDATE `otps` SET `used_at` = NOW() WHERE id = " . AdjustSql($row['id']));

		// Create or get user
		$user = ExecuteRow("SELECT * FROM `users` WHERE `phone` = '" . AdjustSql($phone) . "'");
		if (!$user) {
			ExecuteStatement("INSERT INTO `users` (`phone`, `first_name`, `last_name`) VALUES ('" . AdjustSql($phone) . "', '', '')");
			$user = ExecuteRow("SELECT * FROM `users` WHERE `phone` = '" . AdjustSql($phone) . "'");
		}

		// Build JWT
		$issuedAt = time();
		$exp = $issuedAt + ($TOKEN_EXPIRE_DAYS * 86400);
		$payload = [
			'iat' => $issuedAt,
			'iss' => ServerVar("SERVER_NAME"),
			'nbf' => $issuedAt,
			'aud' => 'https://wptest.com',
			'exp' => $exp,
			'data' => [
				'id' => $user['id'],
				'phone' => $user['phone']
			]
		];

		$jwt = \Firebase\JWT\JWT::encode($payload, $JWT_SECRET, 'HS256');
		$tokenHash = hash('sha256', $jwt);
		$expiresAt = date("Y-m-d H:i:s", $exp);
		$ip = addslashes($_SERVER['REMOTE_ADDR'] ?? '');
		$agent = addslashes($_SERVER['HTTP_USER_AGENT'] ?? '');

		ExecuteStatement("
            INSERT INTO `tokens` (`user_id`, `token`, `ip_address`, `user_agent`, `expires_at`)
            VALUES ('{$user['id']}', '{$tokenHash}', '{$ip}', '{$agent}', '{$expiresAt}')
        ");

		return $json($response, [
			"success" => true,
			"token" => $jwt,
			"message" => "کد صحیح است"
		]);
	});

	// --------------------- PROFILE ---------------------
	$app->get('/profile', function ($request, $response, $args)
	use ($json, $fail, $getBearerToken, $JWT_SECRET) {
		$token = $getBearerToken($request);
		if (!$token) {
			return $fail($response, "Unauthorized", 401);
		}

		$tokenHash = hash('sha256', $token);

		try {
			$decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($JWT_SECRET, 'HS256'));
			if ($decoded->exp < time()) {
				return $fail($response, "توکن منقضی شده است", 401);
			}

			$userId = $decoded->data->id ?? null;
			if (!$userId) {
				return $fail($response, "اطلاعات کاربر ناقص است", 400);
			}

			$exists = ExecuteScalar("SELECT COUNT(*) FROM tokens WHERE user_id = '" . AdjustSql($userId) . "' AND token = '" . AdjustSql($tokenHash) . "'");
			if (!$exists) {
				return $fail($response, "توکن معتبر نیست یا لغو شده", 401);
			}

			$user = ExecuteRow("SELECT id, first_name, last_name, phone, email, birth_date, created_at FROM users WHERE id = '" . AdjustSql($userId) . "'");
			if (!$user) {
				return $fail($response, "کاربر یافت نشد", 404);
			}

			return $json($response, ["success" => true, "user" => $user]);
		} catch (\Firebase\JWT\ExpiredException $e) {
			return $fail($response, "توکن منقضی شده است", 401);
		} catch (\Exception $e) {
			return $json($response, [
				"success" => false,
				"message" => "توکن نامعتبر است",
				"error" => $e->getMessage()
			], 401);
		}
	});

	// --------------------- VALIDATE TOKEN ---------------------
	$app->get('/validate-token', function ($request, $response, $args)
	use ($json, $fail, $getBearerToken, $JWT_SECRET) {
		$token = $getBearerToken($request);
		if (!$token) {
			return $fail($response, "Unauthorized", 401);
		}

		$tokenHash = hash('sha256', $token);

		try {
			$decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($JWT_SECRET, 'HS256'));
			if ($decoded->exp < time()) {
				return $fail($response, "توکن منقضی شده است", 401);
			}

			$userId = $decoded->data->id ?? null;
			if (!$userId) {
				return $fail($response, "اطلاعات کاربر ناقص است", 400);
			}

			$tokenExists = ExecuteRow("
                SELECT * FROM tokens
                WHERE user_id = '" . AdjustSql($userId) . "'
                AND token = '" . AdjustSql($tokenHash) . "'
                AND expires_at > NOW()
            ");

			if (!$tokenExists) {
				return $fail($response, "توکن معتبر نیست یا منقضی شده است", 401);
			}

			return $json($response, ["success" => true, "message" => "توکن معتبر است"]);
		} catch (\Firebase\JWT\ExpiredException $e) {
			return $fail($response, "توکن منقضی شده است", 401);
		} catch (\Exception $e) {
			return $fail($response, "توکن نامعتبر است", 401);
		}
	});
}