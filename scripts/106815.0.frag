
precision mediump float;
uniform float time;
uniform vec2 resolution;
void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.40;
    float waves = 0.065*sin(time*3.0 + position.x*7.0) 
	        + 0.015*sin(0.004/position.x*17.0 - time*2.0) 
	        + 0.035*sin(1./time*2.5 + position.x);
    float color = position.y < waves ?(waves-position.y)*20.0 : 0.0;
    color = min(pow(color,0.5),1.0);
    //gl_FragColor = vec4(vec3(0.19,0.24,0.51),color);
    gl_FragColor = vec4( position.y < waves ? mix(vec3(0.59,0.63,0.86),vec3(0.1,0.5,50),color) : vec3(0.3,0.5,0.5), 1.0 );
}