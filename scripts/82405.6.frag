#extension GL_OES_standart_derivatives : enable
precision highp float;
	
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
    
vec2 sphIt(in vec3 ro, in vec3 rd, in float ra) {
	float b = dot(ro, rd);
	float c = dot(ro, ro) - ra * ra;
	float h = b * b - c;
	if(h < 0.0) return vec2(-1.0);
	h = sqrt(h);
	return vec2(-b - h, -b + h);
}
	
void main() 
{
    vec2 uv=(gl_FragCoord.xy/resolution.xy)/ resolution.y - 0.5;
    
    vec3 ro = vec3(-5, 0, 0);
    vec3 rd = normalize(vec3(1, uv));
    vec2 iter;
    iter = sphIt(ro, rd, 1);
    vec3 col = vec3(0, 0, 0);
    
    if(iter.x > 0)
    {
        vec3 col = vec3(1, 1, 1);
    }
    gl_FragColor = vec4(col, 1);
}