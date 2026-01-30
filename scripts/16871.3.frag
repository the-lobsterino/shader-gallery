#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// physical rainbows

// ratio: 3 = neon, 4 = refracted, 5+ = approximate white
vec3 physhue2rgb(float hue, float ratio) {
    return smoothstep(
        vec3(0.0),vec3(1.0),
        abs(mod(hue + vec3(0.0,1.0,2.0)*(1.0/ratio),1.0)*2.0-1.0));
}

vec3 mono_luma(vec3 color) {
	return normalize(color);
}

vec3 ff_filmic_gamma3(vec3 linear) {
    vec3 x = max(vec3(0.0), linear-0.004);
    return (x*(x*6.2+0.5))/(x*(x*6.2+1.7)+0.06);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	float t = uv.x*3.0+time*0.1;
	
	vec3 color = physhue2rgb(t, float(int(mix(3.0,12.0,uv.y))));	
	color.z = mix(color.z, 0.5, clamp((uv.x-mouse.x)*4.0,0.0,1.0));
	
	
#if 0
	color = pow(color, vec3(2.2));

	gl_FragColor = vec4(ff_filmic_gamma3(color*1.0), 1.0);
#else
	gl_FragColor = vec4(color, 1.0);
#endif
}