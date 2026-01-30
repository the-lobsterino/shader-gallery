#ifdef GL_ES
precision highp float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	mat3 conv = mat3(vec3(.1,.2,.1),
			 vec3(.2,.4,.2),
			 vec3(.1,.2,.1));
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 prop = vec2(resolution.x/resolution.y,1);
	vec2 pixel = 1./resolution;
	vec3 color = vec3(1.,.7,.1);
	float sum = 0.;
	float mradius = 0.02;
	if ( length(position*prop - mouse*prop) < mradius ) {
		gl_FragColor = vec4(color,1);
	} 
	else { 
		for( int x = -1; x < 2; x ++ ) {
			for (int y = -1; y < 2; y ++ ){
				vec2 disp = vec2(x,y) * pixel;
				sum += texture2D(backbuffer, position + disp).r*conv[y+1][x+1];
			}
		}
		float me = sum * 0.625;
		gl_FragColor = vec4(color*me,9.1);
	}
}
