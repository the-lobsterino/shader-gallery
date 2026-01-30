#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


 float LinearToGammaSpace (float value)
{
    if (value <= 0.0)
        return 0.0;
    else if (value <= 0.0031308)
        return 12.92 * value;
    else if (value < 1.0)
        return 1.055 * pow(value, 0.4166667) - 0.055;
    else
        return pow(value, 0.45454545);
}

 float GammaToLinearSpace(float value)
{
    if (value <= 0.04045)
        return value / 12.92;
    else if (value < 1.0)
        return pow((value + 0.055) / 1.055, 2.4);
    else if (value == 1.0)
        return 1.0;
    else
        return pow(value, 2.2);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	float c = LinearToGammaSpace(uv.x);
	c = distance(vec2(uv.x, c), uv.xy);
	c = step(c, 0.005);
	
	float cc = GammaToLinearSpace(uv.x);
	cc = distance(vec2(uv.x, cc), uv.xy);
	cc = step(cc, 0.005);

	float ccc = pow(uv.x, 2.2);
	ccc = distance(vec2(uv.x, ccc), uv.xy);
	ccc = step(ccc, 0.005);
	
	
	float cccc = pow(uv.x, 0.454);
	cccc = distance(vec2(uv.x, cccc), uv.xy);
	cccc = step(cccc, 0.005);
	
	
	vec3 color = vec3(0);
	color += c * vec3(1.0, 0.0, 0.0);
	color += cc * vec3(0.0, 1.0, 0.0);
	color += ccc * vec3(0.0, 0.0, 1.0);
	color += cccc * vec3(0.0, 1.0, 1.0);
	
	
	gl_FragColor = vec4(color, 1.0);
}