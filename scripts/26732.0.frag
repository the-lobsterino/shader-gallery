#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 lightpos;
uniform vec3 lightColor;
uniform float screenHeight;
uniform vec3 lightAttenuation;
uniform float radius;

uniform sampler2D texture;

void main(void)
{
	if (screenHeight > 0.0)
gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
	else
   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}