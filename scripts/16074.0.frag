precision mediump float;
varying vec4 v_Color;
uniform sampler2D u_Texture;
varying vec2 v_TexCoord;
varying vec3 vLightWeight;

void main()
{
	vec4 texColor = v_Color * texture2D(u_Texture, v_TexCoord);
        gl_FragColor = (texColor.rgb * vLightWeight, texColor.a);
}
