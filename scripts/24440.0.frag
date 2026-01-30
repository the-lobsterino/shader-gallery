#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

// wip again, radial propagation alt approach
// avoids badly distorted zooming by moving the edges around
// in polar coords instead of using oversampled video feedback
// first version:    http://glslsandbox.com/e#23511.3
// another version:  http://glslsandbox.com/e#24146.0

void main(void)
{
	vec2 pos = gl_FragCoord.xy/resolution;
	float hist = 
		texture2D(buf,vec2(length(pos-0.5), fract(atan(pos.y-0.5,pos.x-0.5)/6.2831853))).a;
		//texture2D(buf,gl_FragCoord.xy/resolution).a;
	float new =gl_FragCoord.x < 15. ? step(0.5,fract(mouse.x-pos.y)) : texture2D(buf,(gl_FragCoord.xy-vec2(1,0))/resolution).a;
	vec3 color = vec3(1.0);
	gl_FragColor = vec4(color*hist, new);

}