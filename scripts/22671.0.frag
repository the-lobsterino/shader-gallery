#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D iChannel0;

void main( void ) {

	vec4 color = texture2D(iChannel0, vec2(0,0));
	   

	for(int i=0; i<3; i++) {
		color[i]+=1.0/3.0;
		if (color[i] > 1.0)
			color[i]=0.0;
		else
			break;
	}
	gl_FragColor = color;

}