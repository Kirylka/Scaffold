<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'events';

	protected $fillable = ['from', 'to', 'user_id'];

	public function user()
	{
		return $this->belongsTo('App\User');
	}
}
