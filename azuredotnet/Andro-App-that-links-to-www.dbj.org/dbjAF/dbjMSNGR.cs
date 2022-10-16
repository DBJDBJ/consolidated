using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.Support.V4.Content ;

namespace dbjAF
{
	// strings 
	struct S {
		public const string msg_event_name = "dbj-broadcast-event" ;
		public const string msg_event_msg_tag = "dbj-broadcast-event-message" ;
	}

	[BroadcastReceiver]
	class dbjRECEIVER : BroadcastReceiver
	{
		public override void OnReceive (Context context, Intent intent)
		{
			// Extract data included in the Intent
			string message = intent.GetStringExtra(S.msg_event_msg_tag);
			#if DEBUG
			Android.Util.Log.Debug(S.msg_event_name, "Got message: " + message);
			#endif
		}
	}

	// handler of local inter-activity broadcasting 
	sealed class dbjMessenger {

		#region singleton
		private static readonly dbjMessenger singleton_ = new dbjMessenger() ;

		private dbjMessenger() { receiver_ = new dbjRECEIVER (); }

		public static dbjMessenger instance {
			get { return singleton_;}
		}
		#endregion

		dbjRECEIVER receiver_ = null ;
		dbjRECEIVER receiver {
			get { 
				if (receiver_ == null)	receiver_ = new dbjRECEIVER ();
				return receiver_;
			}
		}

		static public void register ( Activity activity_instance_ ) {
			// Register to receive messages.
			LocalBroadcastManager.GetInstance(activity_instance_).RegisterReceiver(
				dbjMessenger.instance.receiver , 
				new IntentFilter(S.msg_event_name)
			);
		}

		/*	unregister from OnPause() since the activity is not visible */
		static public void unregister ( Activity activity_instance_ ) {
			LocalBroadcastManager.GetInstance(activity_instance_)
				.UnregisterReceiver(dbjMessenger.instance.receiver);
		}

		// Send an Intent with an message string in action  
		static public void sendMessage(  Activity activity_instance_ , string payload = "") {
			Intent intent = new Intent(S.msg_event_name);
			// add data
			intent.PutExtra(S.msg_event_msg_tag, payload);
			LocalBroadcastManager.GetInstance(activity_instance_).SendBroadcast(intent);
		} 

	};
}

