#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

void main()
{
	gl_FragColor.rgb = vec3(((length(gl_FragCoord.xy / resolution - mouse) * 4.) > (.5+.3*sin(time*3.0))));
}

