#ifdef GL_ES
precision mediump float;
#endif

float animSpeed = .25;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float PI = 3.14159265358979323846264338327950288419716939937;
	
void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	// adjust for non-1:1 aspect ratio and maximize
	vec2 posAdj;
	if (resolution.x > resolution.y) {
		posAdj = vec2(pos.x*(resolution.x/resolution.y), pos.y);
	} else {
		posAdj = vec2(pos.x, pos.y*(resolution.y/resolution.x));
	}
	float animTime = time*animSpeed;
	
	// distance from origin, adjusted
	float d = sqrt( posAdj.x*posAdj.x + posAdj.y*posAdj.y );
	float r1 = .2;
	float r2 = .5+sin(time*.2)*.28;
	float rMax = 1.6*(r2+.3);
	vec4 col;
	
	vec4 col1  	  = vec4(.3,.7,.7,1.);
	vec4 col2 	  = vec4(.45,.85,.89,1.);
	vec4 fadeCol 	  = vec4(.2,.6,.6,1.);
	vec4 bgCol  	  = vec4(.3,.32,.35,1.)-d/resolution.x*128.;
	vec4 bgCheckerCol = vec4(0.,0.,0.,1.);
	vec4 checkerCol1  = vec4(.33,.48,.48,1.);
	vec4 checkerCol2  = vec4(.23,.28,.28,1.);
	
	
	// background checkerboard "tunnel"
	vec4 tunnelCol = vec4(1.,1.,1.,1.);
	float checkerBoardSize = .178;
	if ( mod(atan(pos.x*( (sin(time*.4)*.5+.5)*.6+2.), pos.y), PI/12.) < PI/24. ) {
		if ( mod(d,checkerBoardSize) < checkerBoardSize*.5 ) {
			tunnelCol = bgCol;
		} else {
			tunnelCol = bgCheckerCol;
		}
	} else {
		if ( mod(d,checkerBoardSize) < checkerBoardSize*.5 ) {
			tunnelCol = bgCheckerCol;
		} else {
			tunnelCol = bgCol;
		}
	}
	gl_FragColor = tunnelCol;
	
	float t = 0.;
	if (d<rMax) {
		if (d<r2) {
			// circle checkerboard "tunnel"
			float checkerBoardSize = .178;
			if ( mod(atan(pos.x*( (sin(time*.4)*.5+.5)*.6+2.), pos.y), PI/12.) < PI/24. ) {
				if ( mod(d,checkerBoardSize) < checkerBoardSize*.5 ) {
					tunnelCol = checkerCol2;
				} else {
					tunnelCol = checkerCol1;
				}
			} else {
				if ( mod(d,checkerBoardSize) < checkerBoardSize*.5 ) {
					tunnelCol = checkerCol1;
				} else {
					tunnelCol = checkerCol2;
				}
			}
			gl_FragColor = tunnelCol;
		}
		
		// shard color blending
		if (d>r2) {
			t = (d-r2)/(rMax-r2);
			t = t*.1+.72;
			col = fadeCol*(1.-t) + tunnelCol*t;
		} else if (d>r1) {
			t = (d-r1)/(r2-r1);
			t = t;
			col = col1*(1.-t) + col2*t;
		}
		else {col = col1;}
		
		// rect shards
		for (float i=0.;i<40.;i++) {
			float a = rand(vec2(i,i))*PI/2.;
			float rRect = rand(vec2(.2,i))*rMax;
			vec2 rectPos = vec2(cos(a)*rRect, sin(a)*rRect);
			float rectSize = .01+.045*d/rMax;
			float rectVariation = 0.04;
			vec2 rectDelta = vec2( rand(vec2(i,.05))*rectVariation+rectSize, rand(vec2(i,.033))*rectVariation+rectSize );
			
			
			// shard movement
			float ampChill = abs(sin(animTime))*.02 + .32;
			float ampFast = sin(animTime)*1.4 + .32;
			float amp = 1.;
			float amplitudeBlend = 1.-sin(animTime)*.5+.5;
			
			amplitudeBlend *= amplitudeBlend*.5;

			// movement blend
			amp = ampChill*amplitudeBlend*.3 + ampFast*(1.-amplitudeBlend)*.6;
			amp = ampFast*amplitudeBlend + ampChill*(1.-amplitudeBlend)*.4;
			
			// rotation
			float currentAngle = atan(rectPos.x, rectPos.y);
			float newAngle = mod( currentAngle+mod(animTime+PI, (PI*2.)), (PI*2.) );
			rectPos = vec2(cos(newAngle*.5)*rRect, sin(newAngle*2.)*rRect);
			
			rectPos *= amp;
			
			// assing generated shard color to generated shard
			if (abs(rectPos.x) < abs(posAdj.x) && abs(posAdj.x) < abs(rectPos.x)+rectDelta.x &&
			    abs(rectPos.y) < abs(posAdj.y) && abs(posAdj.y) < abs(rectPos.y)+rectDelta.y) {
				gl_FragColor = col;
			}
		}
		
		// outline
		if (d<r2 && d>r2-.002) {
			gl_FragColor = vec4(0.,0.,0.,1.);
		}
	}
}