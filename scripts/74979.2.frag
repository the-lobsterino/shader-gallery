

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution



void main(void)
{
    vec2 position = ( gl_FragCoord.xy / resolution.xy )*100.0 ;

	float bord = 0.1;
                   // x1  y1   x2   y2
    vec4 rect = vec4(20.0, 30.0, 40.0, 80.0);
    vec4 rect2 = vec4(rect.x+bord, rect.y+bord, rect.z-bord, rect.w-bord);
    vec4 rect3 = vec4(rect.x-bord, rect.y-bord, rect.z+bord, rect.w+bord);
    vec2 hv = smoothstep(rect.xy, rect2.xy, position) * smoothstep(rect.zw, rect2.zw, position);
    float onOff = hv.x * hv.y;
    vec2 hv2 = smoothstep(rect3.xy, rect.xy, position) * smoothstep(rect3.zw, rect.zw, position);
    float onOff2 = hv2.x * hv2.y;
	
	float terr = max(min(0.1, 0.1-abs(position.x*0.25-floor(position.x*0.25)-(position.y*0.25-floor(position.y*0.25)))), 0.0);
	float terr2 = max(min(0.1, 0.1-abs((position.x+1.0)*0.25-floor((position.x+1.0)*0.25)-((position.y+1.0)*0.25-floor((position.y+1.0)*0.25)))), 0.0);
	
	float force = (1.0-onOff)*onOff2+onOff2*max(terr, terr2)*max(terr, terr2)*10.0*10.0;

    gl_FragColor = mix(vec4(0,0,0,0), vec4(1,0,0,0), force*0.8);
}