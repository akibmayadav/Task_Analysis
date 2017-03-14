 // AXIS CONSTRUCTION
 var task_resource_source_count = new Array(); // to keep a track of how many outputs of a task have been used as inputs in other tasks. 
 var polygon_progress_points = new Array();
 var connection_points = new Array();
 var human_line_points = new Array();
 var circle_points = new Array();

  function axis_construction()
  {
      var xScale = d3.time.scale()
        .domain([min_date, max_date])
        .range([x_margin, width-x_margin]),
        yScale = d3.scale.linear()
        .domain([min_workload, max_workload]).nice()
        .range([height-y_margin,y_margin]);

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(15),
        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

      canvas.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + x_height + ')')
          .call(xAxis);

      canvas.append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate('+ x_width + ',0)')
          .call(yAxis);

      var scale = new Object ; 
      scale.x= xScale;
      scale.y= yScale;
      return scale ;
  }




// DRAWING THE TASKS
function task_polygon_drawn(id)
{
  var points_for_polygon = new Array(); 
  var tasks = canvas.append("g").attr("id",id);
  tasks.selectAll("polygon")
        .data(Task_Data)
        .enter()
        .append("polygon")
        .attr("points",function(d,i){ 
                                    task_resource_source_count[i]=0;
                                    var new_Date = new Date(d.Start_Date);
                                    var min_date_time = min_date.getTime();
                                    var required_Expected_Duration = new Date(d.ExpectedDuration*24*60*60*1000+min_date_time)
                                    var radius = (scale.x(required_Expected_Duration)-scale.x(min_date))/2;
                                    points_for_polygon[i] = n_faced_polygon(scale.x(new_Date),scale.y(d.Workload),radius,d.Resources.length);
                                    var points_for_polygon_final = new Array();
                                    for ( var m =0 ; m < d.Resources.length ;m++)
                                    {
                                      points_for_polygon_final.push(points_for_polygon[i][m].x + "," + points_for_polygon[i][m].y);
                                    }
                                    return(points_for_polygon_final);
                                  })
        .attr("stroke-width", 2)
        .attr("stroke-opacity" , 0.4)
        .attr("fill","#ffffff")
        .attr("fill-opacity",0.0)
        .attr("stroke","#000000");

  return points_for_polygon;
}


function tasks_progress_drawing(refresh_current_date)
{
  canvas.selectAll("[id=tasks_progress]").remove();
  var expected_progress = new Array();
  var actual_progress = new Array();
  var time_for_each_source = new Array();
  var tasks_progress = canvas.append("g").attr("id","tasks_progress");
  tasks_progress.selectAll("polygon")
        .data(Task_Data)
        .enter()
        .append("polygon")
        .attr("points",function(d,i){ 
                                    var new_Date_1 = new Date(d.Start_Date);
                                    var date_con = 24*60*60*1000;
                                    var new_End_Date = new Date(new_Date_1.getTime()+d.ExpectedDuration*date_con);
                                    // To manage conflicts , progress has to be redefined 
                                    if (refresh_current_date>new_Date_1)//task has started 
                                    {
                                      var total_work = d.Resources.length*d.ExpectedDuration*date_con;
                                      var current_work ; 
                                      var number_of_resources ;
                                      time_for_each_source[i]=new Array();
                                      time_holder = new Array();

                                      

                                      if(resources_from_other_tasks[i].length>0)
                                      {
                                        time_holder.push(new_Date_1.getTime());
                                        for ( var a= 0 ;a<resources_from_other_tasks[i].length; a++)
                                        {
                                          //console.log(resources_from_other_tasks[i][a].slice(1,resources_from_other_tasks[i][a].length));
                                          //console.log(resources_from_other_tasks[i][a].len);
                                          var temp_start_date = new Date(Task_Data[resources_from_other_tasks[i][a].slice(1,resources_from_other_tasks[i][a].length)-1].Start_Date);
                                          var temp_end_date = new Date(temp_start_date.getTime()+Task_Data[resources_from_other_tasks[i][a].slice(1,resources_from_other_tasks[i][a].length)-1].ExpectedDuration*date_con);
                                          if(temp_end_date.getTime()>new_Date_1.getTime())
                                          {
                                            time_holder.push(temp_end_date.getTime());
                                          }                                          
                                        }
                                        time_holder.sort();

                                        // calculating time progress
                                        var current_work = 0;
                                        var current_interval ,number_missing_resources;
                                        for ( var t = 0 ; t <time_holder.length ;t++)
                                        {

                                          while(refresh_current_date.getTime()>time_holder[t] && refresh_current_date.getTime()<=time_holder[t+1])
                                          {
                                            current_interval=t;
                                            number_missing_resources = time_holder.length - 1 - t ;
                                            break;
                                          }
                                        }
                                        if (number_missing_resources == undefined)
                                          {
                                            number_missing_resources = 0 ; 
                                          }
                                        
                                        current_work =0 ; 
                                        current_work_constant = 0 ;

                                        for ( var work_count = 0 ; work_count< time_holder.length-number_missing_resources-1 ; work_count ++)
                                        {
                                            var passed_time_interval = time_holder[work_count+1]-time_holder[work_count];
                                            var missing_res = time_holder.length-work_count-1
                                            var resources_available = d.Resources.length-missing_res;
                                            current_work_constant = current_work_constant + (passed_time_interval*resources_available);
                                        }
                                        var last_interval = time_holder.length-number_missing_resources-1 ;
                                        var last_time_interval = refresh_current_date.getTime()-time_holder[last_interval] ;
                                        var resources_available_last_interval = d.Resources.length-number_missing_resources ; 
                                        var current_work_last_interval = last_time_interval * resources_available_last_interval ;

                                        current_work = current_work_constant +current_work_last_interval;
                                        prog = current_work/total_work;
                                      }
                                      else 
                                      {
                                        number_of_resources = d.Resources.length;
                                        current_work = number_of_resources*(refresh_current_date-new_Date_1);  
                                      }

                                     
                                      actual_progress[i] = current_work/total_work *100;
                                      expected_progress[i] = (refresh_current_date-new_Date_1)/(d.ExpectedDuration*date_con)*100;
                                      
                                      if(actual_progress[i]>100)
                                      {
                                        actual_progress[i]=100;
                                      }
                                      if(expected_progress[i]>100)
                                      {
                                        expected_progress[i]=100;
                                      }
                                    }    
                                    if (actual_progress[i] > 0)
                                    {
                                    polygon_progress_points[i]=polygon_progress(i,actual_progress[i],scale.x(new_Date_1),scale.y(d.Workload),points_for_polygon,d.Resources.length);
                                    return(polygon_progress(i,actual_progress[i],scale.x(new_Date_1),scale.y(d.Workload),points_for_polygon,d.Resources.length));
                                    }
                                  })
        .attr("stroke-width", 0)
        .attr("fill",function(d,i)
          {
            if (actual_progress[i]<expected_progress[i])
            {
              return "#ff0000";
            }
            else 
            {
              return "#42C3D0";
            }
          })
        .attr("fill-opacity",function(d){return d.Risk});

 }

// INTERCONNECTIONS 

function interconnections_drawn()
{
var distance_from_task = 20.0;
var interconnections =canvas.append("g").attr("id","Connections");
interconnections.selectAll("path")
                .data(Task_Data)
                .enter()
                .append("path")
                .attr("d", function(d,i) {
                  var points_for_connections = new Array();
                  var count = 0 ;
                  resources_from_other_tasks[i] = new Array();
                  for (var a=0; a<d.Resources.length ;a++)
                  {

                    if (d.Resources[a][0] == "O")
                      { 
                        resources_from_other_tasks[i].push(d.Resources[a]);
                        var x_1 = points_for_polygon[i][a].x;
                        var x_2 = points_for_polygon[i][(a+1)%d.Resources.length].x;
                        var x_3 = (x_1+x_2)/2;
                        var y_1 = points_for_polygon[i][a].y;
                        var y_2 = points_for_polygon[i][(a+1)%d.Resources.length].y;
                        var y_3 = (y_1+y_2)/2;
                        var x_4,y_4;
                        var new_Date = new Date(d.Start_Date);
                        var x_center = scale.x(new_Date);
                        var y_center = scale.y(d.Workload);
                        if (x_2 != x_1)
                        {
                          var m_1 = (y_2-y_1)/(x_2-x_1);
                          x_4 = x_3+(-1*m_1*distance_from_task/Math.sqrt((m_1*m_1)+1));
                          y_4 = y_3-(-1*distance_from_task/Math.sqrt((m_1*m_1)+1));
                        }
                        else 
                        {
                          x_4 = x_3-distance_from_task;
                          y_4 = y_3;
                        }
                        points_for_connections[count] = new Array();
                        points_for_connections[count].push(" M "+x_3+","+y_3);
                        points_for_connections[count].push(" L "+x_4+","+y_4);
                        //var resource_source = d.Resources[a][1];
                        //console.log(d.Resources[a].slice(1,d.Resources[a].length));
                        var resource_source = d.Resources[a].slice(1,d.Resources[a].length);
                        task_resource_source_count[resource_source] = (task_resource_source_count[resource_source]+1)%(Task_Data[resource_source].Resources.length);// to segregate the outputs of a task
                        points_for_connections[count].push(" L "+x_4+","+points_for_polygon[resource_source-1][task_resource_source_count[resource_source]-1].y);
                        points_for_connections[count].push(" L "+points_for_polygon[resource_source-1][task_resource_source_count[resource_source]-1].x+","+points_for_polygon[resource_source-1][task_resource_source_count[resource_source]-1].y);
                        count = count+1;
                      }
                  }
                  connection_points[i] = points_for_connections;
                  return(points_for_connections);

                })
                .attr("stroke","#aaaaaa")
                .attr("stroke-opacity",0.5)
                .attr("stroke-width",2)
                .attr("fill","none");
}

// HUMAN RESOURCES LINES
function human_resources_drawing()
{
var distance_from_resource = 20.0;
var circle_point_count = 0 ; 
var human_resources_lines =canvas.append("g").attr("id","human_resources_lines");
human_resources_lines.selectAll("path")
                .data(Task_Data)
                .enter()
                .append("path")
                .attr("d", function(d,i) {
                  var points_for_connections = new Array();
                  var count = 0 ;
                  for (var a=0; a<d.Resources.length ;a++)
                  {
                    if (d.Resources[a][0] == "H")
                      { 
                        var x_1 = points_for_polygon[i][a].x;
                        var x_2 = points_for_polygon[i][(a+1)%d.Resources.length].x;
                        var x_3 = (x_1+x_2)/2;
                        var y_1 = points_for_polygon[i][a].y;
                        var y_2 = points_for_polygon[i][(a+1)%d.Resources.length].y;
                        var y_3 = (y_1+y_2)/2;
                        var x_4 ,y_4;
                        if(x_2-x_1==0)
                        {
                          x_4 = x_3 - distance_from_resource ;
                          y_4 = y_3 ;
                        }
                        else
                        {
                         var m_1 = (y_2-y_1)/(x_2-x_1);
                         x_4 = x_3+(-1*m_1*distance_from_resource/Math.sqrt((m_1*m_1)+1));
                         y_4 = y_3-(-1*distance_from_resource/Math.sqrt((m_1*m_1)+1));
                        }
                        points_for_connections[count]= new Array();
                        points_for_connections[count].push(" M "+x_3+","+y_3);
                        points_for_connections[count].push(" L "+x_4+","+y_4);
                        circle_points[circle_point_count]= new Object();
                        circle_points[circle_point_count].x = x_4;
                        circle_points[circle_point_count].y = y_4;
                        circle_points[circle_point_count].dept = d.Resources[a][1];
                        count = count +1;
                        circle_point_count = circle_point_count+1;
                      } 
                  }
                  human_line_points[i]=points_for_connections;
                  return(points_for_connections);
                })
                .attr("stroke","#666666")
                .attr("stroke-width",2)
                .attr("stroke-opacity",0.7)
                .attr("fill","none");

// HUMAN RESOURCE CIRCLE
var human_resources_circle =canvas.append("g").attr("id","human_resources_circle");
human_resources_lines.selectAll("circle")
                .data(circle_points)
                .enter()
                .append("circle")
                .attr("cx", function(d,i) {
                  return(d.x);
                })
                .attr("cy" , function(d,i){
                  return(d.y);
                })
                .attr("r",4)
                .attr("stroke-width",0)
                .attr("fill-opacity",0.7)
                .attr("stroke-opacity",0.7)
                .attr("fill",function(d,i){
                    var department = d.dept;
                    var color;
                    if ( department == 1)
                    {
                      color = "#FDBE2D"
                    }
                    if (department == 2)
                    {
                      color = "#E75F3D"
                    }
                    if ( department == 3)
                    {
                      color = "#8CA85C"
                    }
                    if (department == 4)
                    {
                      color = "#3C7670" 
                    }
                    if ( department == 5)
                    {
                      color = "#D81A5F"
                    }
                    if (department == 6)
                    {
                      color = "#FEF53B" 
                    }
                    return(color);
                });
}