precision highp float;

uniform float time;
uniform vec2 resolution;


// More Mods By NRLABS 2016

float speed = 0.010;

float ball(vec2 p, float fx, float fy, float ax, float ay)
{
	vec2 r = vec2(p.x + sin(time*speed / 2.0 * fx) * ax * 12.0, p.y + tan(time*speed/ 2.0 * fy) * cos(ay) * 8.0);	
	return .00507 / length(r*0.9 / sin(fy * time * 0.009));
}

void main(void)
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
	
	float col = 0.0 ,col2 = 0.0;
	for(float i=0.; i<1119.; i++) {
    	col += ball(p*19., i, i, 0.002*i, -i* 0.005);
 	 }
	
	
	
	//col2 += ball(p, 14.1, 23.5, 0.09, 0.08);
	
	gl_FragColor = vec4(pow(col * 0.1 * col2,3.0/col), col * 1.1, col2 * 2.5 * sin(time), 1.0) + vec4(sin(col2 * 0.33), col * col2 * 0.24 * cos(time),col2*0.1,1.0);
}