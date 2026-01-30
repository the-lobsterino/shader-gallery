#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float precision_scale = 5.;
float line_width = 0.03;
bool threshold( float i, float t ){
        if ( i > t - line_width/2. && i < t + line_width/2. ){
	  return true;
	}else{
	  return false;
	}
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )- vec2(0.5,0.5);
	position = position * precision_scale;
	float color;
	if ( threshold(position.y,-position.x*position.x)  ){
	   color = 1.;
	}else{
	   color = 0.;
	}

	gl_FragColor = vec4( 0.,color,0.,0 );

}