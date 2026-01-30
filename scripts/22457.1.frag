#ifdef GL_ES
precision mediump float;
#endif

////////////////////////////////
//          VRG corp	      //
//            Wow,	      //
//   It's bitchin as boobin   //
////////////////////////////////

// Note: move the mouse to theupper left corner to get fractal-like patterns :)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D bb;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 loopBack(vec2 uv, vec3 color, float start, float margin, float rot){
	if(length(uv) < start ){
	//if(abs(uv.x) < x && abs(uv.y) < y){
		uv = vec2(uv.x*cos(rot)-uv.y*sin(rot), uv.y*cos(rot)+uv.x*sin(rot));
		return texture2D(bb, uv/vec2(2.-margin, (2.-margin)*resolution.y/resolution.x)+vec2(.5)).rgb;	
	}
	return color;
}


void main( void ) {

	vec2 tex = gl_FragCoord.xy / resolution.xy;
	vec2 uv = tex;
	uv-=vec2(.5);
	uv.y*=resolution.y/resolution.x;
	uv*=2.;
	
	float dist=length(uv);
	float angle = atan(uv.y, uv.x);
	
	float k = dist*20. - time*2.;
	
	float angleA = step(0., cos(angle*20.+k));
	float angleB = step(0., cos(angle*20.-k));
	float angleC = step(0., cos(angle*20.));
	
	vec3 color = vec3(angleA, angleB, angleC);
	
	color = mix(color, vec3(rand(vec2(floor(dist*256.+5.*time)))), angleA*angleB*angleC);
	
	color = pow(color, vec3(1.0/1.2));
	color -=pow(clamp(length(uv)-.01, 0., 1.), 4.);
	
	
	color = loopBack(uv, color, .75, (mouse.x-.5)/4., time/(10.+mouse.y*.1));
	
	
	gl_FragColor = vec4( color, 1. );

}