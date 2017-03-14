
 // DRAWING THE TASKS
function task_polygon_drawn_for_indiviual(id,task_number)
{
  var points_for_polygon_final =new Array();
  for ( var m =0 ; m < Task_Data[task_number].Resources.length ;m++)
  {
    points_for_polygon_final.push(points_for_polygon[task_number][m].x + "," + points_for_polygon[task_number][m].y);
  }
  var tasks = canvas.append("g").attr("id",id);
  tasks .append("polygon")
        .attr("points",points_for_polygon_final)
        .attr("stroke-width", 2.0)
        .attr("stroke-opacity" , 1.0)
        .attr("fill","#ffffff")
        .attr("fill-opacity",0.0)
        .attr("stroke","#000000");

}

function tasks_progress_drawing_on_click(task_number,id)
{
  var tasks_progress = canvas.append("g").attr("id",id);
  tasks_progress.append("polygon")
                .attr("points",polygon_progress_points[task_number])
                .attr("stroke-width", 0)
                .attr("fill", "#b2317a")
                .attr("fill-opacity",1.0);

 }

function interconnections_click_drawn(id,task_number)
{
var distance_from_task = 20.0;
var interconnections =canvas.append("g").attr("id",id);
interconnections.append("path")
                .attr("d",connection_points[task_number])
                .attr("stroke","#000000")
                .attr("stroke-opacity",1.0)
                .attr("stroke-width",2.0)
                .attr("fill","none");
}

// HUMAN RESOURCES LINES
function human_resources_drawing_on_click(task_number,id)
{
var distance_from_resource = 20.0;
var circle_points = new Array();
var circle_point_count = 0 ; 
var human_resources_lines =canvas.append("g").attr("id",id);
human_resources_lines
                .append("path")
                .attr("d", human_line_points[task_number])
                .attr("stroke","#000000")
                .attr("stroke-width",2.0)
                .attr("stroke-opacity",1.0)
                .attr("fill","none");
}

