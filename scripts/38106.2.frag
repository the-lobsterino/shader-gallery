#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// i dont understand why this result is different than in the sahdertoy version here : https://www.shadertoy.com/view/4dcGDS
// i'm fairly certain it is the pixelformat of the renderbuffers:
// here the brightness is getting clamped to a wide "plateau" that follows instead of shrinking
// (as if shadertoy is resampling a narrower cross section of the remaining spike as it uniformly falls/gets shorter?)
// would need a webgl debug thingy :P

// i have found that shadertoy switch between 2 texture in the same fbo, and glslsandbox switch 2 FBO with one texture in each.
// in the case of sahdertoy, with texture with type Gl_Float instead of UNISGNED_BYTE like glslsandbox, the motion blur is better quality but not same as this https://www.shadertoy.com/view/4dcGDS
// i not understand where is the difference, maybe the bitrate ?? in sahdertoy, the rtifact of the motion blur desapear quickly and dont disapear in glslsandbox ( the artifact in the zone where there is no overlap)

// i would expect a floating point texture to easily enable what shadertoy does (higher range)
// but I thought it used all 32 bits for 1 channel and the buffers are 4-channel as usual... clues anyone?
// the part that doesn't disappear seems to be another symptom of using 8 bits/channel unsigned:
// things are imprecise and i suppose some step is rounding up, not down, so when it accumulates
// a dim halo remains unless you drop the multiple and make everything dimmer like so

// ok rgba can be float. that's probably the whole deal
// gonna get sandbox off github and see

// bangin. rgba float for sure but only with an extension, what's that 128 bit pixels? ;)
// git clone https://github.com/mrdoob/glsl-sandbox.git
// then edit glsl-sandbox/static/index.html
// find function named createTarget( width, height )
// at beginning insert a line:
// gl.getExtension('OES_texture_float');
// go down a few lines and change
// gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
// to
// gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null );
//
// then point your browser at index.html (it comes up file:///home/d00d/src/glsl-sandbox/static/index.html
// temporarily allow scripts for file:/// because scripts are default blocked ;)
// select all of default shader
// paste-overwrite this one
// looks just like shadertoy.

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform float time;

void main()
{
	float halfpi = atan(-1.0)*-2.0;
	vec2 s = resolution.xy;
	vec2 g = gl_FragCoord.xy;
	vec4 h = texture2D(backbuffer, g / s);
	g = (gl_FragCoord.xy * 2.-s)/s.y*1.3;
    vec2 
        k = vec2(halfpi,0) + mod(time,4.0 * halfpi), 
        a = g - sin(k),
    	b = g - sin(2.09 + k),
    	c = g - sin(4.18 + k);
	gl_FragColor = (0.02/dot(a,a) + 0.02/dot(b,b) + 0.02/dot(c,c)) * 0.04 + h * 0.95 + step(h, vec4(.8,.2,.5,1)) * 0.01;
}