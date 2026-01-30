#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

bool inCircle(vec2 position, vec2 offset, float size) {
    float len = length(position - offset);
    if (len < size) {
        return true;
    }
    return false;
}

vec2 tex(vec2 uv)
{
	return texture2D(backbuffer, uv).xy;
}

void main( void ) {

	vec2 uv =  ( gl_FragCoord.xy / resolution.xy );
	vec2 pixel = 1./resolution;

	vec2 cp = tex(uv).xy;
	
	vec2 lap = vec2(0.0, 0.0); 
	lap =
		0.05 * tex(uv + pixel * vec2(-1,  -1)).xy +
		0.20 * tex(uv + pixel * vec2(0, -1)).xy +
		0.05 * tex(uv + pixel * vec2(1, -1)).xy +
		
		0.20 * tex(uv + pixel * vec2(-1, 0)).xy +
		-1.0 * tex(uv + pixel * vec2(0,  0)).xy +
		0.20 * tex(uv + pixel * vec2(1, 0)).xy +
		
		0.05 * tex(uv + pixel * vec2(-1, 1)).xy +
		0.20 * tex(uv + pixel * vec2(0, 1)).xy +
		0.05 * tex(uv + pixel * vec2(1, 1)).xy;
	
	float dA = 1.0;
	float dB = 0.35;
	float f = 0.055;
	float k = 0.062;
	
	//f=.0367, k=.0649
	
	vec2 col = vec2(0);
	col.x = cp.x + (dA * lap.x) - (cp.x * cp.y * cp.y) + (f * (1.0 - cp.x));
    	col.y = cp.y + (dB * lap.y) + (cp.x * cp.y * cp.y) - ((k + f) * cp.y); 
	
	if (inCircle (uv, mouse, 0.01)) {
		col.y+=0.4;
    	}

	gl_FragColor.x = clamp(col.x, 0.0, 1.0);  
	gl_FragColor.y = clamp(col.y, 0.0, 1.0);  		
	gl_FragColor.z = clamp(col.y*2.5, 0.0, 1.0);
	gl_FragColor.w = 1.0;
	

}