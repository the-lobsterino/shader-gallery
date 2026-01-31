#extension GL_OES_standard_derivatives : enable

uniform float time;
attribute float idx;
uniform float u_len;
uniform float u_range;
uniform float u_size;
uniform float u_time;

varying float u_capacity;  // 透明度, 利用点所在的位置计算透明度

void main( void ) {
	
   float size = u_size;
   float total_number = u_total * mod(u_time, 1.0);
  
   
   if (total_number > a_position && total_number < a_position + u_range) {
   
     // 拖尾效果
     float index = (a_position + u_range - total_number) / u_range;
     size *= index;
     
     
     v_opacity = 1.0;
   } else {
     v_opacity = 0.0;
   }
   
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   gl_PointSize = size / 10.0;	

}