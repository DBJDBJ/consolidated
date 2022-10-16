

namespace dbjorgview
{
	using System;
	using System.Security.Permissions;
	using System.Threading ;
	using Android.App;
	using Android.Content;
	using Android.Runtime;
	using Android.Views;
	using Android.Widget;
	using Android.OS;
	using Android.Webkit;

	struct Util {
		const int min_val = 0 , max_val = 1000 * 60 ;
		public static void vibrr ( long value = 0 ) 
		{
			var vibro_ = Android.OS.Vibrator.FromContext ( app_context );
			if (value > min_val && value < max_val) vibro_.Vibrate ( value ); 
		} 

		public static Android.Content.Context app_context { get { return Android.App.Application.Context ; }}

		public static string app_name { get { return app_context.GetString (Resource.String.app_name); }}

		public static void log_debug ( string msg ) {
			#if DEBUG
			Android.Util.Log.Debug ( Util.app_name, msg );
			#endif
		}
		public static void log_err ( string msg ) {
			Android.Util.Log.Error ( Util.app_name, msg );
		}

		public static void toast ( string msg ) {
			Toast.MakeText ( app_context,  Util.app_name + " Exit...", ToastLength.Long).Show() ;
		}

		/*
		 * calling example
		 * alert_dialog("Title", "Message", this,(s,e) ==> {if (e.Result) { Finish();}} ) ;
		*/
		public static void alert_dialog ( Activity host, string title, string message, System.EventHandler<Android.Content.DialogClickEventArgs> handler ) {

			var alertDialogBuilder = new AlertDialog.Builder (host);
			// set title
			alertDialogBuilder.SetTitle (title);
			// set dialog message
			alertDialogBuilder
				.SetMessage (message)
				.SetCancelable (false)
				.SetNeutralButton("OK", handler);
			// create alert dialog
			var alertDialog = alertDialogBuilder.Create ();
			// show it
			alertDialog.Show ();
		}
	}

	#region networking utils
	class Networker {

		public struct Stat {

			public bool connected ;
			public bool wifi      ;
			public bool gprs      ;

			public Stat ( bool initval ) {
				connected = wifi = gprs = false ;
			}
		}

		Activity user_ = null ;
		Android.Net.ConnectivityManager mgr_ = null ;

		public Networker ( Activity user ) {
			this.user_ = user ;
			this.mgr_ = 
				(Android.Net.ConnectivityManager)
				user_.GetSystemService(Android.Content.Context.ConnectivityService);
		}

		public Networker.Stat DetectNetwork()
	   {
			var connectivityManager = this.mgr_ ;
			var retval_ = new Networker.Stat(false);

		var activeConnection = connectivityManager.ActiveNetworkInfo;

		if ((activeConnection != null) && activeConnection.IsConnected)
		{
			// we are connected to a network.
				retval_.connected = true;
		}

			var mobile = connectivityManager.GetNetworkInfo(Android.Net.ConnectivityType.Mobile).GetState();
			if (mobile == Android.Net.NetworkInfo.State.Connected)
		{
				// We are connected via mobile data
				retval_.gprs = true;
		}

			var wifiState = connectivityManager.GetNetworkInfo(Android.Net.ConnectivityType.Wifi).GetState();
			if (wifiState == Android.Net.NetworkInfo.State.Connected)
		{
				// We are connected via wifi
				retval_.wifi = true;
		}
			return retval_;
		}

		static public bool check ( Activity host ) {

			var networker_ = new Networker (host);

			var retval = networker_.DetectNetwork ().connected;

			if (false == retval ) {
				Util.alert_dialog (host,Util.app_name, "Network not found?",(sender, evt) => { host.Finish (); });
			}
			return retval;
		}
	}
		#endregion

	[Activity (Label = "dbjorgview", Theme = "@android:style/Theme.NoTitleBar")]
	public class MainActivity : Activity
	{
		WebView web_view;

		string home_url { 
			get { return GetString(Resource.String.home_url ); }
		}

		string splash_url {
			get {return GetString(Resource.String.home_url); }
		}


		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			try {

				if ( Networker.check(this) ) {
						// Set our view from the "main" layout resource
						SetContentView (Resource.Layout.Main);

						web_view = FindViewById<WebView> (Resource.Id.webview);
						web_view.Settings.JavaScriptEnabled = true;
							web_view.LoadUrl ( this.splash_url);

						web_view.SetWebViewClient (new dbjorgviewClient ());
				}
			} catch ( SystemException x ) {
				Util.toast( x.Message ) ;
				Util.log_err(x.StackTrace);
			}
				Util.log_debug( this.GetType().Name + "::OnCreate");
		}

		public override bool OnKeyDown (Android.Views.Keycode keyCode, Android.Views.KeyEvent e)
		{
			if (Networker.check (this)) {
				Util.log_debug (this.GetType ().Name + "::OnKeyDown");
				if (keyCode == Keycode.Back) {
					if (web_view.CanGoBack ()) {
						web_view.GoBack ();
						return true;
					}
					Util.log_debug ("Exit");
					this.Finish ();
					return false;
				}
			}
			return base.OnKeyDown (keyCode, e);
		}

		private class dbjorgviewClient : WebViewClient
		{
			public override bool ShouldOverrideUrlLoading (WebView view, string url)
			{
				Util.log_debug ( this.GetType().Name + "::ShouldOverrideUrlLoading");
				view.LoadUrl (url);
				return true;
			}

			public override void OnPageFinished (WebView view, string url)
			{
				Util.log_debug ( this.GetType().Name + "::OnPageFinished");
				try {
				base.OnPageFinished (view, url);
					SplashActivity.ON = false ; /* this does the initial vibrating also */
				} catch ( SystemException x  ) {
					Util.log_err  (this.GetType().Name + "::OnPageFinished exception" + x.StackTrace);
			}
			}

		}
	}
	/*
	 * splash screen (as an activity)
	*/
	[Activity(Theme = "@style/Theme.Splash",  MainLauncher = true, NoHistory = true)]
	public class SplashActivity : Activity
	{
		static bool on_ = false ;
		public static bool ON {
			get { return on_ ; }
			set { 
//				if ( on_ == false && value == true ) Vibro.rr(1000);
				on_ = value; 
			}
		}

		protected override void OnCreate(Bundle bundle)
		{

			base.OnCreate(bundle);

			if ( Networker.check(this) ) {
				SplashActivity.ON = true;
				Intent i = new Intent (this, typeof(MainActivity));
				StartActivity (i);
			}
			Util.log_debug ( this.GetType().Name + "::OnCreate");
		}

		protected override void OnResume () {
			base.OnResume() ;
			Util.log_debug( this.GetType().Name + "::OnResume");
		}
		protected override void OnPause () {
			base.OnPause() ;
			Util.log_debug( this.GetType().Name + "::OnPause");
		}
	}

	#region catch_all

	class CatchAll 
	{

		// [System.Security.Permissions  (SecurityAction.Demand, Flags=SecurityPermissionFlag.ControlAppDomain)]
		static CatchAll()
		{
			AppDomain currentDomain = AppDomain.CurrentDomain;
			currentDomain.UnhandledException += new UnhandledExceptionEventHandler(MyHandler);
		}

		static void MyHandler(object sender, UnhandledExceptionEventArgs args) 
		{
			Exception e = (Exception) args.ExceptionObject;
			Util.log_err ("Unhandled Exception caught : " + e.Message);
			Util.log_err( string.Format("Runtime terminating: {0}" , args.IsTerminating));

			Util.toast( " TERMINATING ON ERROR " + e.Message );
		}
	}
	#endregion
}


