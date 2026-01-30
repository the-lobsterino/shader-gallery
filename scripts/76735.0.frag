

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy )-.5;
	//uv.x*=resolution.x/resolution.y;
	
	float ratio = (sin(time*.1)*1.5+0.0)*2.+1.;
	
	uv*=ratio;
	
	vec3 col = vec3(1.);
	
	float d = abs((mouse.x-.5)*ratio+1.-uv.x);
	float d2 = abs((mouse.y-.5)*ratio-uv.y);
	float d3 = distance(uv,mouse*1.);
	//uv*=(d3*.01);
	uv.x*=ratio-d;
	uv.y*=ratio-d2;
	uv *= length(uv);
	vec2 id = floor(uv);
	//uv.x*=d;
	//id.x+=d;
	//col *= d;
	//vec2 id2 = floor(uv);
	col = mod(id.x+id.y,2.)==0.?vec3(1.,.1,sin(time*.354)*.5+.5):vec3(.4,sin(time*.867)*.5,1.);
	//col *= smoothstep(0.2,0.1,distance(uv,(mouse*10.)));
	gl_FragColor = vec4( col, 1.0 );

}