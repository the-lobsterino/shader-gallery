#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	float scale=min(resolution.x/1.0 , resolution.y);
	uv.x *= resolution.x / scale;
	uv.y += sin(-time*2.0+uv.x*4.0)*(gl_FragCoord.x/5000.0);
	uv.y *= resolution.y / scale;
	if(uv.x>1.4&&uv.x<2.0){
		uv.x += sin(time*2.0+uv.y*4.0)/20.0;
	}
	
	vec3 finalColor = step(length( uv ), 0.5) * vec3( 1.0, 0.0, 0.0 );
	finalColor += step( dot( finalColor, finalColor ), 0.1 );
	float lum=cos(-time*2.0+uv.x*4.0+3.1415/1.0)/4.0+0.75;
	gl_FragColor = vec4( finalColor*lum, 1.0 );
	if(abs(uv.y)>0.9||abs(uv.x)>1.5){
		gl_FragColor = vec4( 0.0,0.0,0.0, 1.0 );
	}
	if(uv.x<-1.5 && uv.x>-1.7 && uv.y-sin(-time*2.0+uv.x*4.0)*(gl_FragCoord.x/5000.0)<0.98){
		gl_FragColor = vec4( 0.0+sin(-gl_FragCoord.x/10.0),0.0+sin(-gl_FragCoord.x/10.0),0.0+sin(-gl_FragCoord.x/10.0), 1.0 );
	}
	
	if (time < 150.0)
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		glBindFragDataLocation(p, 0, "colorOut");

}