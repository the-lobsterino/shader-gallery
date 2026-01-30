precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;

float line1(vec2 uv)
{
    float t = 0.0008 / abs(uv.y) * 1.0;
    return t;
}

float line2(vec2 uv)
{
    float t = 0.0008 / abs(uv.x) * 1.0;
    return t;
}

float inline1(vec2 uv, float timeVal)
{
    float t = 0.002 / abs(uv.y + sin(-timeVal) * 0.3) * 1.0;
    return t;
}

float inline2(vec2 uv, float timeVal)
{
    float t = 0.002 / abs(uv.x - cos(-timeVal) * 0.3) * 1.0;
    return t;
}

float rotateline(vec2 uv, float timeVal)
{
    float t = 0.002 / abs(uv.y - (uv.x * tan(timeVal))) * 1.0;
    return t;
}

float square(vec2 uv)
{
    float t = 0.002 / abs( min(0.4-abs(uv.x),0.4-abs(uv.y))) * 1.0;
    return t;
}

float circle(vec2 uv)
{
    float t = 0.002 / abs(0.3 - length(uv)) * 1.0;
    return t;
}

float point(vec2 uv)
{       
	float t = 0.004
	/ length(uv);
    t = pow(t, 5.0);
    return t;
}

float sinwave(vec2 uv, float timeVal)
{
    float t = 0.01 / abs(uv.y + sin(-timeVal + uv.x * 10.0 - 4.0)*0.3) * 1.0;
    return t;
}

float coswave(vec2 uv, float timeVal)
{
    float t = 0.01 / abs(uv.x - cos(-timeVal*1.0+uv.y * 10.0 - 4.0)*0.3) * 1.0;
    return t;
}

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float dot2(in vec2 v ) { return dot(v,v); }

void main(void) {
    vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy)/resolution.y;
    float PI = 3.1416;
    vec3 result = vec3(0.0, 0.0, 0.0);
    float timeVal = time*PI;
    
    result = mix(result, vec3(1.0 ,0.0, 0.1), line1(uv));
    result = mix(result, vec3(0.0 ,0.1, 1.0), line2(uv));
    result = mix(result, vec3(1.0, 1.0, 1.0), circle(uv));
    
    if (abs(uv.x) <= 0.4) {
    	result = mix(result, vec3(1.0 ,0.14, 0.6), inline1(uv,timeVal));
    }
    if (abs(uv.y) <= 0.4) {
    	result = mix(result, vec3(0.05 ,0.3, 1.0), inline2(uv,timeVal));
    }
        
    if (abs(uv.x) > 0.4 && uv.x >= 0.0) {
	    result = mix(result, vec3(1.0 ,0.14, 0.6), sinwave(uv,timeVal));
    }
    if (abs(uv.y) > 0.4 && uv.y >= 0.0) {
    	result = mix(result, vec3(0.05 ,0.3, 1.0), coswave(uv,timeVal));
    }
    
    if (length(uv) < 0.3) {
        if (uv.x > 0.0 && uv.y > 0.0 && -cos(-timeVal) < 0.0 && sin(-timeVal) < 0.0 ) {
            result = mix(result, vec3(0.5, 0.5, 0.5), rotateline(uv,timeVal));
        } else if (uv.x < 0.0 && uv.y > 0.0 && -cos(-timeVal) > 0.0 && sin(-timeVal) < 0.0 ) {
            result = mix(result, vec3(0.5, 0.5, 0.5), rotateline(uv,timeVal));    
        } else if (uv.x < 0.0 && uv.y < 0.0 && -cos(-timeVal) > 0.0 && sin(-timeVal) > 0.0 ) {
            result = mix(result, vec3(0.5, 0.5, 0.5), rotateline(uv,timeVal));    
        } else if (uv.x > 0.0 && uv.y < 0.0 && -cos(-timeVal) < 0.0 && sin(-timeVal) > 0.0 ) {
            result = mix(result, vec3(0.5, 0.5, 0.5), rotateline(uv,timeVal));    
        }
    }
    
    result += vec3(0.1, 0.1, 0.1)*square(uv);

    vec2 point_uv = uv;
    point_uv.x += -cos(-timeVal) * 0.3;    
    point_uv.y += sin(-timeVal) * 0.3;
	float point = point(point_uv);
    result += (vec3(1.0 ,1.0, 1.0))*point*60.0;
    
    gl_FragColor = vec4(result,1.0);
}