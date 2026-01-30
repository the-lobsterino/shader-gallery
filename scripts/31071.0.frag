#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float light = 0.0;
	float power = 2.0;
	float x = 0.0;
	float y = 0.0;
	float dist = 0.0;
	float weight = resolution.x / 60.0;
	float adjust = ( resolution.x * 3.0 / 4.0 - 10.0 - resolution.x * 1.0 / 10.0 ) / 5.0;
	float yWidth = resolution.x / 30.0;
	float xWidth = resolution.x / 70.0;
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	
	power -= sin( time  );
	
	
	
	if( abs( gl_FragCoord.y - resolution.y / 2.0 ) < yWidth ){
		dist = abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 );
		if( dist < weight / 2.0 ){
			r = 0.7 - dist / resolution.x * 100.0;
			g = r;
			b = r;
		}
	}
	
	if( gl_FragCoord.x - ( resolution.x * 3.0 / 4.0 - xWidth ) > 0.0 && gl_FragCoord.x - ( resolution.x * 3.0 / 4.0 - xWidth ) < resolution.x * 0.1 ){
		dist = abs( gl_FragCoord.y - resolution.y / 2.0 );
		if( dist < weight / 1.6 ){
			r = 0.7 - dist / resolution.x * 100.0;
			g = r;
			b = r;
		}
	}
	
	
	if( abs( gl_FragCoord.y - resolution.y / 2.0 ) < xWidth / 1.0 ){
		if( gl_FragCoord.x > resolution.x / 11.5 && gl_FragCoord.x < resolution.x / 5.0 ){
			dist = abs( gl_FragCoord.x - resolution.x / 11.5 ) / resolution.x;
			r += cos( ( abs( gl_FragCoord.y - resolution.y / 2.0 ) ) / resolution.x * 100.0 ) * sin( dist * 15.0 ) * power;
		}
		if( gl_FragCoord.x < ( resolution.x * 3.0 / 4.0 - xWidth * 3.0 ) && gl_FragCoord.x > resolution.x / 5.0 ){
			r += cos( ( abs( gl_FragCoord.y - resolution.y / 2.0 ) ) / resolution.x * 100.0 ) * power;
		}
		if( gl_FragCoord.x > ( resolution.x * 3.0 / 4.0 - xWidth * 3.0 ) && gl_FragCoord.x < ( resolution.x * 3.0 / 4.0 - xWidth / 2.0 ) ){
			dist = abs( gl_FragCoord.x - ( resolution.x * 3.0 / 4.0 - xWidth / 2.0 ) ) / resolution.x;
			r += cos( ( abs( gl_FragCoord.y - resolution.y / 2.0 ) ) / resolution.x * 100.0 ) * sin( dist * 50.0 ) * power;
		}
	}
	
	if( abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 ) < xWidth / 0.6 ){
		if( abs( gl_FragCoord.y - resolution.y / 2.0 ) > yWidth / 1.2 && abs( gl_FragCoord.y - resolution.y / 2.0 ) < yWidth * 1.5 ){
			dist = ( abs( gl_FragCoord.y - resolution.y / 2.0 ) - yWidth / 1.2 ) / resolution.x;
			r += cos( ( abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 ) ) / resolution.x * 130.0 ) * sin( dist * 50.0 ) * power;
		}
		if( abs( gl_FragCoord.y - resolution.y / 2.0 ) > yWidth * 1.5 && abs( gl_FragCoord.y - resolution.y / 2.0 ) < yWidth * 3.0 ){
			r += cos( ( abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 ) ) / resolution.x * 130.0 ) * power;
		}
		if( abs( gl_FragCoord.y - resolution.y / 2.0 ) > yWidth * 3.0 && abs( gl_FragCoord.y - resolution.y / 2.0 ) < yWidth * 4.5 ){
			dist = ( yWidth * 4.5 - abs( gl_FragCoord.y - resolution.y / 2.0 ) ) / resolution.x;
			r += cos( ( abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 ) ) / resolution.x * 130.0 ) * sin( dist * 30.0 ) * power;
		}
	}
	
	
	
	
	
	
	if( gl_FragCoord.x < ( resolution.x * 3.0 / 4.0 - xWidth ) && gl_FragCoord.x > resolution.x / 10.0 ){
		x = ( gl_FragCoord.x - resolution.x * 1.0 / 10.0 + adjust ) / ( resolution.x / 1.0 );
		y = x * sqrt( 1.0 - pow( x, 2.0 ) ) * weight;
		dist = abs( gl_FragCoord.y - resolution.y / 2.0 );
		if( gl_FragCoord.y - resolution.y / 2.0 > 0.0 && dist - y < sin( time * 100.0 + x * ( xWidth * 8.0 ) ) * xWidth / 5.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( gl_FragCoord.y - resolution.y / 2.0 < 0.0 && dist - y < cos( time * 100.0 + x * ( xWidth * 8.0 ) ) * xWidth / 5.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( dist < y ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
	}
	
	
	
	if( ( gl_FragCoord.y - resolution.y / 2.0 ) > yWidth && ( gl_FragCoord.y - resolution.y / 2.0 ) < yWidth * 4.5 ){
		y = ( resolution.y / 2.0 + yWidth * 4.5 - gl_FragCoord.y + adjust / 3.5 ) / ( resolution.x / 4.5 );
		x = y * sqrt( 1.0 - pow( y, 2.0 ) ) * weight * 3.0 / 4.0;
		dist = abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 );
		if( gl_FragCoord.x - resolution.x * 3.0 / 4.0 < 0.0 && dist - x < sin( time * 100.0 + y * ( xWidth * 4.0 ) ) * xWidth / 6.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( gl_FragCoord.x - resolution.x * 3.0 / 4.0 > 0.0 && dist - x < cos( time * 100.0 + y * ( xWidth * 4.0 ) ) * xWidth / 6.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( dist < x ){
			r += 1.0;
		        g = 0.8;
			b = 0.8;
		}
	}
	if( ( gl_FragCoord.y - resolution.y / 2.0 ) < -yWidth && ( gl_FragCoord.y - resolution.y / 2.0 ) > -yWidth * 4.5 ){
		y = abs( resolution.y / 2.0 - yWidth * 4.5 - gl_FragCoord.y - adjust / 3.5 ) / ( resolution.x / 4.5 );
		x = y * sqrt( 1.0 - pow( y, 2.0 ) ) * weight * 3.0 / 4.0;
		dist = abs( gl_FragCoord.x - resolution.x * 3.0 / 4.0 );
		if( gl_FragCoord.x - resolution.x * 3.0 / 4.0 < 0.0 && dist - x < sin( time * 100.0 + y * ( xWidth * 4.0 ) ) * xWidth / 6.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( gl_FragCoord.x - resolution.x * 3.0 / 4.0 > 0.0 && dist - x < cos( time * 100.0 + y * ( xWidth * 4.0 ) ) * xWidth / 6.0 ){
			r += 1.0;
			g = 0.8;
			b = 0.8;
		}
		if( dist < x ){
			r += 1.0;
		        g = 0.8;
			b = 0.8;
		}
	}
	
	
		
	gl_FragColor = vec4( r, g, b, 1.0 );

}