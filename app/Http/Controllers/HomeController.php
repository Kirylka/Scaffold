<?php namespace App\Http\Controllers;


use App\Event;
use App\User;
use Illuminate\Database\Eloquent;
use Illuminate\Support\Facades\Input;

class HomeController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//$this->middleware('auth');

		//parent::__construct();

		//$this->news = $news;
		//$this->user = $user;
	}


	/**
	 * Show the application dashboard to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		$clients = \DB::table('users')->orderBy('username', 'asc')->lists('username','id');
		return view('pages.home',compact('clients'));
	}

	public function events()
	{
		$events =  \DB::table('events')
			->leftJoin('users', 'events.user_id', '=', 'users.id')
			->select('events.from as start_date','events.user_id', 'events.to as end_date','events.id','events.id as text','users.username as first_name','users.name as last_name','users.email')
			->get();

		foreach ($events as &$event) {
			$event->start_date = date("m/d/Y H:i", strtotime($event->start_date));
			$event->end_date = date("m/d/Y H:i", strtotime($event->end_date));
		}

		return $events;
	}

	public function postEvents()
	{
		$id = \Input::get('id');
		$user_id = \Input::get('user_id');

		$event = Event::findOrNew($id);
		$event->from = \Input::get('from');
		$event->to = \Input::get('to');


		if ($user_id) {
			$event->user_id = $user_id;
		}
		else {
			$user = new User();
			$user->username = \Input::get('first_name');
			$user->name = \Input::get('last_name');
			$user->email = \Input::get('email');
			$user->save();
			$event->user_id = $user->id;
		}
		$event->save();

		if (isset($user)) return $user;

	}

	public function deleteEvent()
	{
		$id = \Input::get('id');

		$event = Event::findOrFail($id);
		$event->delete();

	}

	public function users()
	{
		return \DB::table('events')
			->leftJoin('users', 'events.user_id', '=', 'users.id')
			->select('events.from as start_date', 'events.to as end_date','events.id','events.id as text','users.username as first_name','users.name as last_name','users.email as email')
			->get();

	}

	public function user()
	{
		$id = \Input::get('user_id');
		$user = User::findOrFail($id);
		$events = $user->events()->get();

		return ['events'=>$events, 'user'=>$user];
	}



}