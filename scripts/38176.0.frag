#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

// i dont understand why this result is different than in the shadertoy version here : https://www.shadertoy.com/view/4dcGDS

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

//  thanks, it work in the browser, but in fact, out of the browser, i have the same things with GL_UNSIGNED_BYTE and GL_FLOAT,
// and i dont understand why. for me the FLOAT are 16bits, so with this extention OES_texture_float we have more than 16bits ?

// don't know. it could be 16 and not look awful like RGB 5-6-5 bits but drivers etc can still do whatever they will.
// i say because once in ogre3d (1.10?), i could get a different pixelformat and screw everything up, in spite of what i specified
// when creating the rendertexture, just by writing a different type to gl_FragColor :(
// that was nvidia i think, i didn't spend longer figuring out who and why, years ago anyway
// however, comparing
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
// and
// https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
// it seems like it "should" be 32.

// yep its 32 bit float with this extention
// ok so i have done glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA32F, m_Size.x, m_Size.y, 0, GL_RGBA, GL_FLOAT, 0);
// on my laptop with quadro 4400 gpu, i have the same as GL_UNISGNED_BYTE, but at home with my GTX 760 TI it
// work like shadertoy and the glslSandbox local modified version
// so on my laptop i fail to do in local the same as with webgl.. :) maybe the driver problem, i have often
//	problem with this gpu for many shader of shadertoy

// by the way thanks all for you help :)

// quadro 4400 has kinda old opengl version, not so surprised. 
// seems for regular software there's still a float texture extension for this, may be called GL_NV_float_buffer:
// https://www.opengl.org/registry/specs/NV/float_buffer.txt
// np, it's been a nice distraction

// maybe im wrong, my job laptop is a HP ZBook 17 G3 with good gpu Quadro M not sure about the version, and i have opengl 4.4.
// but like said, i have many problem with many shaders
// thanks for the tip i will study the float buffer, but i see its a nv extention, but maybe there is similar extention for intel gpu and amd gpu
// my XShade V2 offline glsl editor come with good new features :)

// ah that makes way more sense than some obsolete thing D:
// sorry that seems like a "fun mystery" for you... got no ideas left.
// ARB_texture_float could be better and likely work on all vendors anyway, even long ago, according to that txt
// though it's weird if you'd even need an extension to do it right in 4.4--
// in webgl spec things are sorta young, I guess? 

// i confirm the problem with my gpu on the job laptop. 
// my soft must work on opengl 2.0 mini, so when i activate opengl 4.4 it work like that, but on opengl 2.0 there is some weird things :)
// but its normal i guess :)

// would you like a jelly baby? :)
// no thanks, Tom.


uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform float time;

vec4 texture2D_bicubic(sampler2D tex, vec2 uv)
{
	vec2 ps = 1./resolution;
	vec2 uva = uv+ps*.5;
	vec2 f = fract(uva*resolution);
	vec2 texel = uv-f*ps;
#define bcfilt(a) (a<2.?a<1.?((3.*a-6.)*a*a+4.)/6.:(((6.-a)*a-12.)*a+8.)/6.:0.) 
	vec4 fxs = vec4(bcfilt(abs(1.+f.x)), bcfilt(abs(f.x)),
			bcfilt(abs(1.-f.x)), bcfilt(abs(2.-f.x)));
	vec4 fys = vec4(bcfilt(abs(1.+f.y)), bcfilt(abs(f.y)),
			bcfilt(abs(1.-f.y)), bcfilt(abs(2.-f.y)));
#undef bcfilt
	vec4 result = vec4(0);
	for (int r = -1; r <= 2; ++r)
	{
		vec4 tmp = vec4(0);
		for (int t = -1; t <= 2; ++t)
			tmp += texture2D(tex, texel+vec2(t,r)*ps) * fxs[t+1];
		result += tmp * fys[r+1];
	}
	return result;
}

float section(vec2 g)
{
	return step(-2.0,g.x) * step(g.x,2.0) * step(-2.0,g.y) * step(g.y,2.0);
}

void main()
{
	float halfpi = atan(-1.0)*-2.0;
	vec2 s = resolution.xy;
	vec2 g = gl_FragCoord.xy;
	vec2 uv = g / s;
	vec4 h = texture2D(backbuffer, uv);
	g = (gl_FragCoord.xy * 2.-s)/s.y*4.0;
	float altfield = section(g);
	float t = halfpi * 0.5;
	g *= mat2(cos(t),-sin(t),sin(t),cos(t));
	float field = section(g);
	float color = 0.0;
	vec2 k,a,b,c;
	for (int i = -7; i < 8; ++i)
	{
		float prec = 0.005;
		
        	k = vec2(halfpi + float(i) * 0.1,0) + mod(time * 0.1 * (float(i) + 0.4) * 0.2, 4.0 * halfpi) + mouse, 
		a = mod(g - sin(k + k * log(k)*0.9),g+0.001)-g*.5,
	    	b = mod(g - sin(2.09 + k * sin(k)*0.8),g+0.001)-g*.5,
	    	c = mod(g - sin(4.18 + k * cos(k)*0.7),g+0.001)-g*.5;
		color += (prec/dot(a,a) + prec/dot(b,b) + prec/dot(c,c));
	}
	//field = altfield;
	//field = step(length(g),2.0*mouse.y);
	//field = clamp(step(uv.x,0.55)*step(0.45,uv.x) + step(uv.y,0.57)*step(0.43,uv.y), 0.0, 1.0); //try with g*= mat2(... off
	//field = clamp(step(g.x,0.7)*step(-0.7,g.x) + step(g.y,0.7)*step(-0.7,g.y),0.0,1.0); //try with zoom=vec2(0.99)
	//vec2 zoom = vec2(0.99);
	vec2 zoom = vec2(0.99,0.997);
	vec4 stream = texture2D_bicubic(backbuffer,(uv-vec2(0.5))*zoom+vec2(0.5));
	gl_FragColor = color * vec4(length(a),length(b),length(c),1) * 0.001
			+ (h * 0.97 + step(h, vec4(.8,.2,.5,1)) * 0.01) * field
			+ stream * (1.0 - field);
}