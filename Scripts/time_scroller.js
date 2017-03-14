function time_indicator(x)
{
  canvas.selectAll("[id=Current_Time_Block]").remove();
  canvas.append("line")
    .attr("id","Current_Time_Block")
    .attr("x1",x)
    .attr("x2",x)
    .attr("y1",y_margin)
    .attr("y2",height-y_margin+30)
    .attr("stroke","#000000")
    .attr("stroke-width",5)
    .attr("stroke-opacity",0.5);
}

function timer_motion(current_time)
{
   var current_date = scale.x.invert(current_time);
   tasks_progress_drawing(current_date);
   time_indicator(current_time);
}

function frame() {
    if (current_time_starting>width-x_margin) {
        clearInterval(id);
    } else {
        current_time_starting= current_time_starting+0.1;
        timer_motion(current_time_starting);
        starting_coordinate = current_time_starting;
    }
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 39: //right . makes the time bar go ahead
            current_time_starting += 2;
            timer_motion(current_time_starting);            
            break;
        case 37: //left . makes the time bar go behind
            current_time_starting -= 2;
            timer_motion(current_time_starting);
            break;
        case 32: //Spacebar to make the animation start
            timeline_play();
            break;
        case 73: //Press I for interconnections
            interconnection_switch();
            break;
    }
};

  function timeline_play()
   {
    if(playing == 0)
    {
      clearInterval(id);
      playing = 1;
    }
    else if(playing == 1)
    {
      id = setInterval(frame, 1);
      playing = 0;
    }
   }