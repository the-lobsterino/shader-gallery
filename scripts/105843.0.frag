#define zoOM    ( 1./2. )
#define spEED	( 50./1. )

precision highp float; 
uniform float time; uniform vec2 mouse, resolution;
#define res resolution
void main( void )
	{ vec2 cPos = ( 1./zoOM )*( gl_FragCoord.xy - res/1. )/res.y;
	vec2      m = ( 1./zoOM )*(       mouse*res - res/1. )/res.y;
  	cPos -= m;
	float cLength = .5*length(cPos);
	vec2 col =  gl_FragCoord.xy/res + ( cPos/cLength )*cos( cLength*100. - time*spEED )*.05;
	gl_FragColor = vec4( col, .5, 1. ); }