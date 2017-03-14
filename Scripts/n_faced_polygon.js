// Function to find 2D convex hulls .
function n_faced_polygon( x ,y ,radius , number_of_points )
{
  var points = new Array();
	for ( var t = 0 ; t < number_of_points ; t++)
	{
	var a = x+ radius * Math.cos(t*2*Math.PI/number_of_points) + radius;
	var b = y+ radius * Math.sin(t*2*Math.PI/number_of_points) ;
	//points[t] = a + "," + b;
	points[t] = new Object();
	points[t].x = a;
	points[t].y = b;
	}
  return points;
}

function polygon_progress(task_number,progress,x,y,points_for_polygon,number_of_points)
{
	// SORTING THE ACCORDING TO X 
	var max_x = 0 ;

	for ( var a = 0 ; a < points_for_polygon[task_number].length ; a++)
	{
		if ( max_x < points_for_polygon[task_number][a].x )
		 {
		 	max_x = points_for_polygon[task_number][a].x ;
		 }
	}

	var min_x = max_x;

	for ( var a = 0 ; a < points_for_polygon[task_number].length ; a++)
	{
		if ( min_x > points_for_polygon[task_number][a].x )
		 {
		 	min_x = points_for_polygon[task_number][a].x ;
		 }
	}

	var distance_from_min = progress/100 *(max_x-min_x);
	var X_A = min_x+distance_from_min;

	var less_than_X_A ;

	for ( var a = 0 ; a < points_for_polygon[task_number].length ; a++)
	{
		if (points_for_polygon[task_number][a].x < X_A)
		{
			less_than_X_A = a;
			break;
		}	 
	} 

	var more_than_X_A = less_than_X_A-1;

	var m_num = points_for_polygon[task_number][more_than_X_A].y - points_for_polygon[task_number][less_than_X_A].y;
	var m_den = points_for_polygon[task_number][more_than_X_A].x - points_for_polygon[task_number][less_than_X_A].x;
	var m = m_num/m_den;
	
	var X_B,Y_B,X_C,Y_C ; 
	X_B = X_C = X_A;
	Y_B = (X_A - points_for_polygon[task_number][less_than_X_A].x)*m +  points_for_polygon[task_number][less_than_X_A].y;
	Y_C = 2*y-Y_B;

	var polygon_progress_points = new Array();
	polygon_progress_points.push(X_B+","+Y_B);

	for ( var t = less_than_X_A ; t < points_for_polygon[task_number].length - more_than_X_A  ;t++)
	{
		polygon_progress_points.push(points_for_polygon[task_number][t].x + "," + points_for_polygon[task_number][t].y);
	}

	polygon_progress_points.push(X_C+","+Y_C);

	return(polygon_progress_points);

}