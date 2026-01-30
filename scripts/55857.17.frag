#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Shout-out to h4cker newz
//	> https://news.ycombinator.com/item?id=20346167
//	> https://fractal.parts/

uniform sampler2D backbuffer;

varying vec2 surfacePosition;
uniform vec2 surfaceSize;

vec2 position;

void mixin_box(vec4 boxcoords, float rotation){
	vec2 boxhw;
	vec2 posinbox;
	
	boxhw = 1./(boxcoords.zw-boxcoords.xy);
	
	float cr = cos(rotation);
	float sr = sin(rotation);
	
	posinbox = (position-boxcoords.xy)*boxhw;
	
	posinbox -= boxhw/4.;
	posinbox *= mat2(cr, sr, -sr, cr);
	posinbox += boxhw/4.;
	
	if(max(posinbox.x, posinbox.y) < 1. && min(posinbox.x, posinbox.y) > 0.){
			posinbox = fract(posinbox);
		float R = log(boxhw.x*boxhw.y)/log(1./resolution.x);
		R = -pow(R*R, 0.625)/10.;
		gl_FragColor = min(gl_FragColor, texture2D(backbuffer, posinbox)+R);
	}
}

void mixin_box(vec4 boxcoords){
	mixin_box(boxcoords, 0.);
}



void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy ) ;
	
	position.y += cos(time*10.2+12.*position.x)*0.000064;
	position.x += cos(time*10.2+12.*position.y)*0.000064;
	position.y -= sin(time*10.2+12.*position.x)*0.000064;
	position.x -= sin(time*10.2+12.*position.y)*0.000064;
	vec2 rho = vec2(1., resolution.x/resolution.y);
	
	gl_FragColor = vec4(1);
	
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	
	if(length( (mouse-position)/rho ) < 0.04){
		color += .5;
	}
	
	
	
	mixin_box(vec4(surfacePosition, surfacePosition+surfaceSize/2.));
	
	mixin_box(vec4(.25, .5, .75, 1.));
	
	mixin_box(vec4(.0, .0, .5, 0.5));
	mixin_box(vec4(.5, .0, 1., 0.5));
	
}
