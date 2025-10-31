<?php

/**
 * Centralized Strings Management
 *
 * This class contains all user-facing strings organized by component/section
 * for easy management, translation, and maintenance.
 *
 * @package    DB_Conn
 * @subpackage DB_Conn/includes
 */

class DB_Conn_Strings
{

	/**
	 * Get all strings organized by component/section
	 *
	 * @return array All application strings
	 */
	public static function get_all_strings()
	{
		return array(
			// ==========================================
			// NAVIGATION COMPONENTS
			// ==========================================
			'navigation' => array(
				'bottom_nav' => array(
					'panel' => 'پنل',
					'services' => 'خدمات',
					'help' => 'راهنما',
					'profile' => 'پروفایل',
				),
				'menu' => array(
					'menu_title' => 'منو',
					'about' => 'درباره ما',
					'dark_mode_toggle' => 'تغییر حالت تاریک',
					'logout' => 'خروج',
				),
			),

			// ==========================================
			// AUTHENTICATION PAGES
			// ==========================================
			'auth' => array(
				'signin' => array(
					'page_title' => 'ورود',
					// Step 1: Phone Entry
					'phone_label' => 'شماره موبایل',
					'phone_placeholder' => '09xxxxxxxxx',
					'send_otp_btn' => 'ارسال کد تایید',
					'request_again_in' => 'درخواست مجدد کد در',

					// Step 2: OTP Verification
					'otp_label' => 'کد تایید',
					'otp_placeholder' => '000000',
					'edit' => 'ویرایش',
					'verify_otp_btn' => 'تایید کد',
					'resend_in' => 'ارسال مجدد کد در',
					'seconds' => 'ثانیه',
					'resend_otp_btn' => 'ارسال مجدد کد',
				),
			),			// ==========================================
			// PANEL PAGE
			// ==========================================
			'panel' => array(
				'page_title' => 'پنل',

				// Dashboard Stats
				'stats' => array(
					'total_users' => 'کل کاربران',
					'active_sessions' => 'نشست‌های فعال',
					'connections' => 'اتصالات',
					'uptime' => 'زمان فعالیت',
				),

				// Quick Actions
				'quick_actions' => array(
					'title' => 'اقدامات سریع',
					'new_connection' => 'اتصال جدید',
					'new_connection_desc' => 'افزودن اتصال پایگاه داده',
					'view_reports' => 'مشاهده گزارش‌ها',
					'view_reports_desc' => 'تحلیل و آمار',
					'manage_users' => 'مدیریت کاربران',
					'manage_users_desc' => 'کنترل دسترسی کاربر',
					'settings' => 'تنظیمات',
					'settings_desc' => 'پیکربندی سیستم',
				),

				// Recent Activity
				'recent_activity' => array(
					'title' => 'فعالیت اخیر',
					'view_all' => 'مشاهده همه',
				),
			),

			// ==========================================
			// PROFILE PAGE
			// ==========================================
			'profile' => array(
				'page_title' => 'پروفایل',

				// Navigation Menu
				'navigation' => array(
					'title' => 'منو',
					'panel' => 'پنل',
					'services' => 'خدمات',
					'help' => 'راهنما',
					'about' => 'درباره ما',
					'logout' => 'خروج',
				),

				// Profile Header
				'default_name' => 'مجید برخورداری',
				'default_email' => 'satrapit@gmail.com',
				'edit_profile' => 'ویرایش پروفایل',

				// Profile Information
				'profile_info' => array(
					'title' => 'اطلاعات پروفایل',
					'full_name' => 'نام کامل',
					'email' => 'ایمیل',
					'phone' => 'تلفن',
					'role' => 'نقش',
					'member_since' => 'عضویت از',
					'default_phone' => '09124248164',
					'default_role' => 'مدیر',
					'default_member_date' => '1358/01/22',
				),

				// Account Settings
				'account_settings' => array(
					'title' => 'تنظیمات حساب',
					'email_notifications' => 'اعلان‌های ایمیل',
					'email_notifications_desc' => 'دریافت بروزرسانی‌های ایمیل',
					'two_factor' => 'احراز هویت دو مرحله‌ای',
					'two_factor_desc' => 'امنیت پیشرفته',
					'dark_mode' => 'حالت تاریک',
					'dark_mode_desc' => 'تغییر پوسته تاریک',
					'marketing_emails' => 'ایمیل‌های بازاریابی',
					'marketing_emails_desc' => 'گزینه‌ها و بروزرسانی‌های جدید',
				),

				// Danger Zone
				'danger_zone' => array(
					'title' => 'منطقه خطر',
					'change_password' => 'تغییر رمز عبور',
					'logout_all_sessions' => 'خروج از تمام نشست‌ها',
					'delete_account' => 'حذف حساب',
				),

				// Plugin Information
				'plugin_info' => array(
					'version' => 'نسخه',
				),

				// Activity Log
				'activity_log' => array(
					'title' => 'گزارش فعالیت',
					'view_full_log' => 'مشاهده گزارش کامل',
				),
			),

			// ==========================================
			// SERVICES PAGE
			// ==========================================
			'services' => array(
				'page_title' => 'خدمات',

				// Service Cards
				'service_cards' => array(
					'database_management' => array(
						'title' => 'مدیریت پایگاه داده',
						'description' => 'مدیریت و نظارت بر اتصالات پایگاه داده خود به طور مؤثر با بینش‌های لحظه‌ای.',
					),
					'security_backup' => array(
						'title' => 'امنیت و پشتیبان‌گیری',
						'description' => 'پشتیبان‌گیری خودکار و ویژگی‌های امنیتی پیشرفته برای محافظت از داده‌های شما.',
					),
					'analytics_reporting' => array(
						'title' => 'تحلیل و گزارش',
						'description' => 'تحلیل جامع و گزارش‌های دقیق برای تصمیم‌گیری‌های مبتنی بر داده.',
					),
					'api_integration' => array(
						'title' => 'یکپارچه‌سازی API',
						'description' => 'یکپارچه‌سازی یکپارچه API برای اتصال به خدمات شخص ثالث.',
					),
					'notifications' => array(
						'title' => 'اعلان‌ها',
						'description' => 'اعلان‌ها و هشدارهای لحظه‌ای برای رویدادها و بروزرسانی‌های مهم.',
					),
					'user_management' => array(
						'title' => 'مدیریت کاربران',
						'description' => 'مدیریت کاربران، نقش‌ها و مجوزها با کنترل دسترسی دقیق.',
					),
				),

				// Service Status
				'status' => array(
					'active' => 'فعال',
					'inactive' => 'غیرفعال',
				),

				// Service Plans
				'plans' => array(
					'title' => 'طرح‌های موجود',
					'basic' => array(
						'name' => 'پایه',
						'price' => '۹ دلار',
						'per_month' => '/ماه',
						'features' => array(
							'۵ اتصال پایگاه داده',
							'تحلیل پایه',
							'پشتیبانی ایمیل',
							'۱ گیگابایت فضای ذخیره‌سازی',
						),
						'button' => 'طرح فعلی',
					),
					'pro' => array(
						'name' => 'حرفه‌ای',
						'price' => '۲۹ دلار',
						'per_month' => '/ماه',
						'badge' => 'محبوب',
						'features' => array(
							'۲۵ اتصال پایگاه داده',
							'تحلیل پیشرفته',
							'پشتیبانی اولویت‌دار',
							'۱۰ گیگابایت فضای ذخیره‌سازی',
							'نظارت لحظه‌ای',
						),
						'button' => 'ارتقا',
					),
					'enterprise' => array(
						'name' => 'سازمانی',
						'price' => '۹۹ دلار',
						'per_month' => '/ماه',
						'features' => array(
							'اتصالات نامحدود',
							'تحلیل سفارشی',
							'مدیر حساب اختصاصی',
							'فضای ذخیره‌سازی نامحدود',
							'پشتیبانی ۲۴/۷',
							'SLA سازمانی',
						),
						'button' => 'تماس با فروش',
					),
				),
			),

			// ==========================================
			// HELP PAGE
			// ==========================================
			'help' => array(
				'page_title' => 'راهنما',

				// Search
				'search_placeholder' => 'جستجوی مقالات راهنما...',

				// Popular Topics
				'popular_topics' => array(
					'title' => 'موضوعات پرطرفدار',
					'getting_started' => array(
						'title' => 'شروع کار',
						'description' => 'اصول اولیه DB Conn را بیاموزید',
					),
					'database_connection' => array(
						'title' => 'اتصال پایگاه داده',
						'description' => 'نحوه اتصال پایگاه داده‌ها',
					),
					'security_best_practices' => array(
						'title' => 'بهترین شیوه‌های امنیتی',
						'description' => 'داده‌های خود را ایمن نگه دارید',
					),
					'advanced_configuration' => array(
						'title' => 'تنظیمات پیشرفته',
						'description' => 'پیکربندی گزینه‌های پیشرفته',
					),
				),

				// FAQ
				'faq' => array(
					'title' => 'سوالات متداول',
					'q1' => array(
						'question' => 'چگونه یک اتصال پایگاه داده جدید ایجاد کنم؟',
						'answer' => 'برای ایجاد یک اتصال پایگاه داده جدید، به صفحه خدمات بروید و روی "مدیریت پایگاه داده" کلیک کنید. سپس روی دکمه "اتصال جدید" کلیک کنید و اطلاعات ورودی پایگاه داده خود را پر کنید.',
					),
					'q2' => array(
						'question' => 'آیا داده‌های من امن است؟',
						'answer' => 'بله، تمام داده‌ها هم در حین انتقال و هم در حالت ذخیره رمزگذاری شده‌اند. ما از پروتکل‌های امنیتی استاندارد صنعت استفاده می‌کنیم تا اطمینان حاصل شود که داده‌های شما در هر زمان محافظت می‌شوند.',
					),
					'q3' => array(
						'question' => 'آیا می‌توانم بعداً طرح خود را ارتقا دهم؟',
						'answer' => 'مطمئناً! می‌توانید در هر زمان طرح خود را ارتقا یا کاهش دهید از صفحه خدمات. تغییرات در چرخه صورتحساب بعدی شما منعکس خواهد شد.',
					),
					'q4' => array(
						'question' => 'چه روش‌های پرداخت را می‌پذیرید؟',
						'answer' => 'ما تمام کارت‌های اعتباری اصلی، PayPal و انتقال بانکی برای طرح‌های سازمانی را می‌پذیریم.',
					),
					'q5' => array(
						'question' => 'چگونه با پشتیبانی تماس بگیرم؟',
						'answer' => 'می‌توانید از طریق ایمیل به آدرس support@dbconn.com با تیم پشتیبانی ما تماس بگیرید یا از فرم تماس در بخش درباره ما استفاده کنید.',
					),
				),

				// Contact Support
				'contact_support' => array(
					'title' => 'هنوز به کمک نیاز دارید؟',
					'description' => 'چیزی که به دنبال آن هستید را پیدا نمی‌کنید؟ تیم پشتیبانی ما اینجاست تا کمک کند!',
					'email_support' => 'پشتیبانی ایمیل',
					'email_address' => 'support@dbconn.com',
					'live_chat' => 'چت زنده',
					'live_chat_desc' => 'در دسترس ۲۴/۷',
					'documentation' => 'مستندات',
					'documentation_desc' => 'راهنماهای جامع',
				),
			),

			// ==========================================
			// ABOUT PAGE
			// ==========================================
			'about' => array(
				'page_title' => 'درباره ما',

				// Header
				'app_name' => 'DB Conn',
				'app_tagline' => 'مدیریت اتصال پایگاه داده',
				'version' => 'نسخه ۲.۱.۰',

				// Mission
				'mission' => array(
					'title' => 'مأموریت ما',
					'paragraph1' => 'در DB Conn، ما به ساده‌سازی مدیریت پایگاه داده برای توسعه‌دهندگان و کسب‌وکارها در تمام اندازه‌ها اختصاص داریم. پلتفرم ما راهی یکپارچه، امن و شهودی برای مدیریت اتصالات پایگاه داده، نظارت بر عملکرد و اطمینان از یکپارچگی داده‌ها فراهم می‌کند.',
					'paragraph2' => 'ما معتقدیم که ابزارهای قدرتمند پایگاه داده باید برای همه در دسترس باشد، به همین دلیل راهکاری ساخته‌ایم که ویژگی‌های سطح سازمانی را با رابط کاربری آسان ترکیب می‌کند.',
				),

				// Key Features
				'key_features' => array(
					'title' => 'ویژگی‌های کلیدی',
					'lightning_fast' => array(
						'title' => 'سریع به سرعت برق',
						'description' => 'بهینه شده برای عملکرد با حداقل تأخیر',
					),
					'enterprise_security' => array(
						'title' => 'امنیت سازمانی',
						'description' => 'رمزگذاری و پروتکل‌های امنیتی در سطح بانکی',
					),
					'realtime_analytics' => array(
						'title' => 'تحلیل لحظه‌ای',
						'description' => 'نظارت بر عملکرد با داشبوردهای زنده',
					),
					'mobile_ready' => array(
						'title' => 'آماده موبایل',
						'description' => 'دسترسی به داده‌های خود از هر مکان و هر دستگاه',
					),
				),

				// Team
				'team' => array(
					'title' => 'تیم ما',
					'member1' => array(
						'name' => 'سارا جانسون',
						'role' => 'مدیرعامل و بنیان‌گذار',
					),
					'member2' => array(
						'name' => 'مایکل چن',
						'role' => 'مدیر فناوری',
					),
					'member3' => array(
						'name' => 'امیلی رودریگز',
						'role' => 'توسعه‌دهنده ارشد',
					),
				),

				// Contact Information
				'contact' => array(
					'title' => 'تماس با ما',
					'email' => 'support@dbconn.com',
					'phone' => '+1 (555) 123-4567',
					'address' => 'خیابان پایگاه داده ۱۲۳، شهر فناوری، ۱۲۳۴۵',
				),

				// Social Links
				'social' => array(
					'title' => 'شبکه‌های اجتماعی',
					'follow_us' => 'ما را دنبال کنید',
				),
			),

			// ==========================================
			// COMMON/SHARED STRINGS
			// ==========================================
			'common' => array(
				'buttons' => array(
					'save' => 'ذخیره',
					'cancel' => 'لغو',
					'delete' => 'حذف',
					'edit' => 'ویرایش',
					'view_all' => 'مشاهده همه',
					'learn_more' => 'بیشتر بدانید',
					'get_started' => 'شروع کنید',
					'contact_us' => 'تماس با ما',
				),
				'status' => array(
					'active' => 'فعال',
					'inactive' => 'غیرفعال',
					'pending' => 'در انتظار',
					'completed' => 'تکمیل شده',
				),
				'time' => array(
					'seconds' => 'ثانیه',
					'minutes' => 'دقیقه',
					'hours' => 'ساعت',
					'days' => 'روز',
					'ago' => 'پیش',
				),
			),
		);
	}

	/**
	 * Get strings for a specific section
	 *
	 * @param string $section Section name (e.g., 'navigation', 'auth', 'panel')
	 * @return array Section strings or empty array if not found
	 */
	public static function get_section($section)
	{
		$all_strings = self::get_all_strings();
		return isset($all_strings[$section]) ? $all_strings[$section] : array();
	}

	/**
	 * Get a specific string by path
	 *
	 * @param string $path Dot-notation path (e.g., 'auth.signin.phone_label')
	 * @return string|array String value or empty string if not found
	 */
	public static function get($path)
	{
		$keys = explode('.', $path);
		$strings = self::get_all_strings();

		foreach ($keys as $key) {
			if (!isset($strings[$key])) {
				return '';
			}
			$strings = $strings[$key];
		}

		return $strings;
	}
}