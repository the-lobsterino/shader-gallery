#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;


//}

vec2 saturate(vec2 x)
{
	return clamp(x, 0.0, 1.0);   
}

vec2 magnify(vec2 uv)
{
    uv *= resolution.xy; 
    return (saturate(fract(uv) / saturate(fwidth(uv))) + floor(uv) - 0.5) / resolution.xy;
}

vec2 quantize(vec2 uv)
{
    return (floor(uv * resolution.xy) + 0.5) / resolution.xy;
}

//void mainImage(out vec4 fragColor, vec2 fragCoord)
void main(void)
{
    float t = time * 0.25;
    vec2 sc = gl_FragCoord.xy / resolution.xy;
    
	vec2 uv = vec2(sc.x * 0.1 - 0.05, 0.1) / (sc.y - 1.0);
	uv *= mat2(sin(t * 0.1), cos(t * 0.1), -cos(t * 0.1), sin(t * 0.1));
			
	vec2 uvMod = sc.x < 0.33 ? uv : sc.x < 0.66 ? magnify(uv) : quantize(uv);

   
    float eqRangeLeft = abs(sc.x - 0.33);
    float eqRangeRight = abs(sc.x - 0.66);

    const float lineSize = 4.0;
	float alpha = 0.0;
    float eqRange = lineSize / float(resolution.x);
    if (eqRangeLeft < eqRange)
        alpha = pow(abs(eqRangeLeft - eqRange) / eqRange, 2.0);
    if (eqRangeRight < eqRange)
        alpha = pow(abs(eqRangeRight - eqRange) / eqRange, 2.0);

    float fade = clamp(0.1 / pow(sc.y, 4.0), 0.0, 1.0);
    float c = sin(sin(uvMod.x * 600.0) + sin(uvMod.y * 400.0) + sin(uvMod.x * 300.0 + uvMod.y * 500.0));
    gl_FragColor = (vec4(1,1,1,1) * alpha + vec4(c*c*sc.x * 2.0,c*c*sc.y*0.75,c*sc.x*sc.y*1.5,c) * (1.0 - alpha)) * fade;
}