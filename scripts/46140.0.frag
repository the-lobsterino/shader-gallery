#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate( vec2 pos, float angle ){
	return vec2( pos.x * cos(angle) - pos.y * sin(angle), pos.x * sin(angle) + pos.y * cos(angle) );
}

float createPart(vec2 pos, float angle){
	pos = rotate( pos, angle );
	pos.y += 30.;
	pos.x *= 1.3;
	
	float mask = abs(pos.x / 100.);
	mask += abs(pos.y / 100.);
	mask = smoothstep( .3, .31, mask );
	return mask;
}

float createStar(vec2 pos, float angle){
	float mask = 1.;
	for( float i = 1.; i <= 5.; ++i ){
		mask *= createPart(pos, 6.28/5. * i + angle);
	}
	return mask;
}

float createCircle( float inner, float outer, vec2 pos ){
	float dist = length( pos );
	float mask = 1. - smoothstep(inner, outer, dist );
	return mask;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec2 newpos = position;

	float star = 1. - createStar( newpos / .5 + vec2(0.,-80.), .6 );
	star += 1. - createStar( newpos / .5 + vec2(80.,40.), .8);
	star += 1. - createStar( newpos / .5 + vec2(-80.,40.), -.8);
	vec3 star_col = vec3(star) * vec3(.2,.2,.2);
	
	vec2 mask_pos = position;
	mask_pos -= .5;	
	mask_pos.x *= 2.;
	float dist = length( mask_pos );
	float mask = createCircle(.3, .305, mask_pos );
	
	vec2 mask2_pos = mask_pos;
	mask2_pos.x += .01;
	mask2_pos.y += .016;
	float mask2 = createCircle(.27, .275, mask2_pos );
	
	vec2 mask2_col_pos = mask2_pos;
	mask2_col_pos.x += .04;
	mask2_col_pos.y += .1;
	float mask2_col_mask = smoothstep(.0, .4, length(mask2_col_pos));
	vec3 mask2_col = mix(vec3(.8, .3, .0), vec3(.8, .6, .0), mask2_col_mask);
	mask2_col *= mask2;
	mask2_col = vec3(mask) - vec3(mask2) + mask2_col;
	
	vec2 mask3_pos = mask2_pos;
	mask3_pos.x += .15;
	mask3_pos.y += .16;

	mask3_pos = rotate( mask3_pos, .77 );
	mask3_pos.x *= 4.;
	mask3_pos.y *= 8.;
	float mask3 = createCircle(.45, .48, mask3_pos );
	mask2_col += vec3(mask3);

	gl_FragColor = vec4(mask2_col-star_col, 1.);

}