#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool circleArea(vec2 pointA, vec2 pointB, float radio){

	if(radio*radio == ((pointA.x-pointB.x)*(pointA.x-pointB.x)) + ((pointA.y-pointB.y)*(pointA.y-pointB.y))){
		return true;
	}
	else{
		return false;
	}


}
void main( void ) {
    
    vec2 U = gl_FragCoord.xy;
    vec4 f = resolution.xyxy;
	vec2 cords = gl_FragCoord.xy / resolution.xy;
      f = length(U+=U-f.xy)/f;
      f = sin(f.w-.1) * vec4(sin(6./f + atan(U.x,U.y)*4. - time).w < 0.);

   gl_FragColor = vec4(f.x, 0.0, f.x * 0.5, f.y*1.0);
	
	if(circleArea(cords.xy,vec2(0.75,0.5),10.0))	{
		gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	}
	//gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}