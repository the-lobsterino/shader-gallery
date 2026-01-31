precision highp float;
uniform   float time;
uniform   vec2  resolution;
uniform   vec2  surfaceSize;
varying   vec2  surfacePosition;

mat2 ro(float a)
{
	return mat2(cos(a),-sin(a),sin(a),cos(a));
}

void main( void ) 
{
	vec2 p = surfacePosition;//( gl_FragCoord.xy / resolution.xy ) -0.5;
	float dp = dot(p,p);
	float q = dp-surfaceSize.x*surfaceSize.y;
	float t = time*q;
	p*=ro(q-time/t);
	p/=t*dp;
	float sx = 0.3 * (p.x*p.x*8.0 - 0.7) * cos( 123.0 * p.x - 15. * pow(t*0.3, .17)*9.);
	float dy = 9./ ( 423. * abs(p.y - sx));
	dy += 11./ (200. * length(p - vec2(p.x, 0.0)));
	gl_FragColor = vec4( (p.x + 0.2) * dy, 0.3 * dy, dy, 1.0 );
	gl_FragColor.rgb = fract(gl_FragColor.rgb);

}