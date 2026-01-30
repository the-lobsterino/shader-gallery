// 090620 Necip's creation

precision mediump float;
uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 aspect = resolution.xy / resolution.y;
	vec2 uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
	
	uv *= 4. + 2.*sin(time);
	
	float c = 0.0;
	if ((uv.x*uv.x + uv.y*uv.y) > .05) c = 1.;
	
	c *= uv.x*uv.x/uv.y +  uv.y*uv.y/uv.x * cos(time)*10.;	
	c *= uv.x*uv.x*uv.y +  uv.y*uv.y*uv.x * sin(time)*10.;
	
	gl_FragColor = vec4(vec3(c, log(c*c), exp(c*c*c)), 1.0);
}