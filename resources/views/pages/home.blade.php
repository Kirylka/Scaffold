@extends('app')
@section('styles')
    <link rel="stylesheet" href="packages/scheduler/codebase/dhtmlxscheduler.css" type="text/css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <style type="text/css" media="screen">

        #my_form {
            position: absolute;
            top: 100px;
            left: 200px;
            z-index: 10001;
            display: none;
            background-color: white;
            padding: 20px;
            font-family: Tahoma;
            font-size: 10pt;
            width: 600px;
        }

    </style>
@endsection
@section('title') Home :: @parent @stop
@section('content')
<div class="row">
    <div class="col-md-8 col-sm-8 col-lg-8">
        <div class="page-header">
            <h2>Calendar</h2>
        </div>
        <div id="my_form" style="display: none; top: 356px; left: 164px;">
            <div class="form-group">
                <label for="start_date" class="col-sm-2 control-label">Start date</label>
                <div class="col-sm-10">
                    <input required="required" type="date" class="form-control" id="start_date">
                </div>
            </div>
            <div class="form-group">
                <label for="end_date" class="col-sm-2 control-label">End date</label>
                <div class="col-sm-10">
                    <input required="required" type="date" class="form-control" id="end_date" >
                </div>
            </div>

            <div class="form-group">
                <label for="first_name" class="col-sm-2 control-label">First name</label>
                <div class="col-sm-10">
                    <input required="required" type="text" class="form-control" id="first_name" placeholder="First name">
                </div>
            </div>

            <div class="form-group">
                <label for="last_name" class="col-sm-2 control-label">Last name</label>
                <div class="col-sm-10">
                    <input required="required" type="text" class="form-control" id="last_name" placeholder="Last name">
                </div>
            </div>

            <div class="form-group">
                <label for="last_name" class="col-sm-2 control-label">Email</label>
                <div class="col-sm-10">
                    <input required="required" type="text" class="form-control" id="email" placeholder="Email">
                </div>
            </div>


            <div class="form-group">
                <label for="end_date" class="col-sm-2 control-label">Client</label>
                <div class="col-sm-10">
                   <select required="required" name="client" id="client">
                       <option value="">---</option>
                       @foreach($clients as $key => $value)
                           <option value="{{$key}}">{{$value}}</option>
                       @endforeach
                   </select>
                </div>
            </div>

            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" name="save" value="Save" id="save" onclick="save_form()"  class="btn btn-default">Save</button>
                    <button type="submit" name="delete" value="Delete" id="delete" onclick="delete_event()"  class="btn btn-default">Delete</button>
                    <button type="submit" name="close" value="Close" id="close" onclick="close_form()"  class="btn btn-default">Close</button>
                </div>
            </div>

        </div>
        <div id="scheduler_here" class="dhx_cal_container" style='width:100%; height:500px; padding:10px;'>
            <div class="dhx_cal_navline">
                <div class="dhx_cal_prev_button">&nbsp;</div>
                <div class="dhx_cal_next_button">&nbsp;</div>
                <div class="dhx_cal_today_button"></div>
                <div class="dhx_cal_date"></div>
                <div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>
                <div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>
                <div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>
            </div>
            <div class="dhx_cal_header"></div>
            <div class="dhx_cal_data"></div>
        </div>
    </div>
    <div class="col-md-4 col-sm-4 col-lg-4">
        <div id="clientDetails" style="display: none; background-color: #007196; color: #ffffff ">
            Name: <span id="userName"></span> <br>
            Email: <span id="userEmail"></span> <br>
            Events: <span id="dates"></span>
        </div>
    </div>

</div>


@endsection

@section('scripts')
    @parent
    <script src="packages/scheduler/codebase/dhtmlxscheduler.js" type="text/javascript"></script>
    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="js/calendar.js" type="text/javascript"></script>
@endsection
@stop
