precision lowp float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void) {

vec2 position = ( gl_FragCoord.xy / resolution.xy);
float aspect_ratio = resolution.x / resolution.y;
      position = position * 1.5 - 1.0;
      position.x = position.x * aspect_ratio;
      position.y = position.y *sin(time);
	
	
	
vec2 center = vec2 (1.0,0.0);
float r = 0.3;
        center.x = r * cos(time);
center.y = r * sin(time*5.0)-0.2;
float color = distance(position, center);
       color = step(sin(time*2.0), color);
	

	gl_FragColor = vec4( cos(time*2.0), 1.0, color, 1.0);

}