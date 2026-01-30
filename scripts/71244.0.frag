#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy ;
	uv -=0.5;
	uv.x *=resolution.x / resolution.y;
	
	vec3 color = vec3(0.0);	
	
	uv = uv*rotate2d(1.5708); //rotation to 90 degree
	float scale = 0.4;
	
	//my magic for drawing triangle shape :-)	
	float a = uv.x+uv.y+scale;
	float b = uv.x-uv.y+scale;
	float c = scale-uv.x;
	
	float tmp = min(a,b);
	tmp = min(tmp, c);
	
	float result = smoothstep(0.199,0.20, tmp);
	
	color = vec3(result);	
	gl_FragColor = vec4( color, 1.0 );

}