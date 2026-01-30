// dogshit edits 4 u
precision highp float;
uniform   float time;
uniform   vec2  resolution;


vec3 face(vec2 p)
{
	p.x *= resolution.x/resolution.y;
	
	float ss = sin(time*0.65)*0.5;
	ss += 3.0;
	p.x += sin(time+p.y*3.0)*0.25;
	ss*=0.25;

	p*=ss;
	
	
	vec3 col = vec3(0.0);
	vec2 op = p;	
	// head
	if (length(p) < 0.5) col = vec3(1,0.75,0); 
	//  smile
	if (length(vec2(1,1)*(p-vec2(-0,-0.025))) < 0.32) col = vec3(0,0,0); 
	if (length(vec2(1,1)*(p-vec2(-0,+0.025))) < 0.32) col = vec3(1,0.75,0); 
	if (length(vec2(1,1)*(p-vec2(0.35+0.02,-0.025+0.00))) < 0.10) col = vec3(1,0.75,0); 
	if (length(vec2(1,1)*(p-vec2(-0.35-0.02,-0.025+0.00))) < 0.10) col = vec3(1,0.75,0); 
	// dimple
	p.x = abs(p.x); 
	p -= vec2(0.35,-0.01); 
	float ang = atan(p.y,p.x); 	
	if (ang > -2.8 && ang < -1.4 && abs(length(p)-0.1) < 0.005) col = vec3(0,0,0); 
	p = op; 
	// eyes
	if (length(vec2(2,1)*(p-vec2(0.15,0.15))) < 0.12) col = vec3(0,0,0); 
	if (length(vec2(2,1)*(p-vec2(-0.15,0.15))) < 0.12) col = vec3(0,0,0); 
	

	return col;
	
	
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	
	vec2 pp = p;
	
	//p.y = mod(p.y,0.5)-0.25;

	p.x +=sin(p.y*p.x);
	
	float t = time*0.5;
	
	float tt = 0.6+(cos(abs(p.x))*0.4+sin(time)*0.21);
	
	
	float sx = .2 * (p.x*p.x*7.0 - 0.7) * cos( tt*99.0 * p.x - 15. * pow(t*0.3, 0.7)*9.);
	float dy = 14./ ( 723. * abs(p.y - sx));
	dy*=2.25+sin(p.x*p.y*time*0.25)*0.5;
	
	vec3 c1 = face(pp*2.0);
	vec3 c2 = vec3( (p.y + 0.4) * dy, 0.45 * dy, p.y+0.2*dy);
	
	
	
	gl_FragColor = vec4( c1+c2, 1.0 );

}