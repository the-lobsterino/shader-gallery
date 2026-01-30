#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 collide(vec2 circlePos,float radius,vec2 boxSize){
	vec2 collisionPoint = vec2(-1000,-1000);
	
	bool insideOuterBox = all(lessThanEqual(abs(circlePos),boxSize + radius));
	bvec2 insideCross = lessThanEqual(abs(circlePos),boxSize);
	
	if(insideOuterBox){
		if(any(insideCross)){
			collisionPoint =  mix(vec2(abs(circlePos.x),boxSize.y),
				     vec2(boxSize.x,abs(circlePos.y)),
				     float(insideCross.y));
		}else{
			if(distance(boxSize,abs(circlePos)) <= radius){
				collisionPoint = boxSize;
			}	
		}
	}
	return sign(circlePos) * collisionPoint;
}

void main( void ) {
	vec2 p = gl_FragCoord.xy/resolution - 0.5;
	p.x *= resolution.x/resolution.y;
	p*=3.0;
	
	vec2 circlePos = 3.0 * (mouse.xy - 0.5);
	circlePos.x *= resolution.x/resolution.y;
	float radius = 0.2;
	vec2 boxSize = vec2(0.3,0.5);
	
	//visuals:
	float circle = step(distance(p,circlePos),radius);
	float box = step(max(abs(p.x)/boxSize.x,abs(p.y)/boxSize.y),1.0);
	
	float roundbox = step(length(max(abs(p) - boxSize,vec2(0))),radius);
	
	gl_FragColor = mix(
		vec4(circle,box,roundbox,1),
		vec4(0,1,0,1),
		float(distance(p,collide(circlePos,radius,boxSize)) < 0.01)
	);
}