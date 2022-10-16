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

	[Activity (Label = "dbjACTIVITY")]			
	public class dbjACTIVITY : Activity
	{
	


		protected Android.Content.ISharedPreferences
		 preferences {
			get { return this.GetPreferences (FileCreationMode.Private); }
		}

		/*
		Called when the activity is first created. This is where you should do all of your normal static set up: create views, bind data to lists, etc. This method also provides you with a Bundle containing the activity's previously frozen state, if there was one.
Always followed by onStart().
		*/
		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			// Create your application here
		}
		/*
		Called when the activity is becoming visible to the user. Followed by onResume() if the activity comes to the foreground, or onStop() if it becomes hidden.
		*/
		protected override void OnStart() {
			base.OnStart ();
		}
		/*	Called after your activity has been stopped, prior to it being started again. Always followed by onStart()*/
		protected override void OnRestart() {
			base.OnRestart ();
		}
		/*Called when the activity will start interacting with the user. At this point your activity is at the top of the activity stack, with user input going to it. Always followed by onPause().*/
		protected override void OnResume() {
			base.OnResume ();
			dbjMessenger.register (this);
		
		}
		/*Called when the system is about to start resuming a previous activity. This is typically used to commit unsaved changes to persistent data, stop animations and other things that may be consuming CPU, etc. Implementations of this method must be very quick because the next activity will not be resumed until this method returns. Followed by either onResume() if the activity returns back to the front, or onStop() if it becomes invisible to the user.*/
		protected override void OnPause() {
		/*Note that it is important to save persistent data in onPause() instead of onSaveInstanceState(Bundle) because the latter is not part of the lifecycle callbacks, so will not be called in every situation*/

			dbjMessenger.unregister (this);
			base.OnPause();
		}
		/*Called when the activity is no longer visible to the user, because another activity has been resumed and is covering this one. This may happen either because a new activity is being started, an existing one is being brought in front of this one, or this one is being destroyed. Followed by either onRestart() if this activity is coming back to interact with the user, or onDestroy() if this activity is going away.*/
		protected override void OnStop() {
			base.OnStop ();
		}
		/*The final call you receive before your activity is destroyed. This can happen either because the activity is finishing (someone called finish() on it, or because the system is temporarily destroying this instance of the activity to save space. You can distinguish between these two scenarios with the isFinishing() method.*/
		protected override void OnDestroy() {
			base.OnDestroy ();
		}

	}
}

