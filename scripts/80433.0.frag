// Me again. WolfJR.
// This is Rotating/Wavy BG
// Im serious wut is this...?

// what this is ???
// rotating checkerboard, aligned to mouse cursor, pretty simple i kno...
// that shitty edit you did caused the wavyness of the thing i guess mr WolfJR...

// Note From WolfJR: Ok thx. Also yeah. i made a shitty edit lol.
// but well... thx. also i dunno why it does not follow the cursor as u say'd...
// 
// note from hell to WolfJR: it doesn't follow the cursor anymore, because you edited it. 
//
// Note From WolfJR to Hell: yes becuz the normal side (Where the bg follows the cursor) Its in the corner in the left, in down.
// But... How to fix it?
//
// --> in line  38 "vec2 p = (49.*gl_FragCoord..." change that crazy "49." back to "2." again
// and then in the next line at the end it should say "...-1.0+2.0.*mouse.y);"
//                X                         -note from me
//
// Note From WolfJR: Ok thx

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rotate(a) mat2(cos(a), sin(a), -sin(a), cos(a))

#define PATTERN         1.2
#define ZOOM_SPEED      0.1
#define ROTATION_SPEED  2.7

void main(void)
{
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
	p -= vec2(-2.0+4.0*mouse.x, -1.0+2.0*mouse.x);
	p *= rotate(ROTATION_SPEED*time);
	vec3 c = vec3(9.0, 0.1, 9.0);
	c += sign(sin(PATTERN * p.x)); 
	c *= sign(sin(PATTERN * p.y)); 
	c.xz = vec2(0.25, 0.75);

	
	gl_FragColor = vec4(c, 2.9);

}