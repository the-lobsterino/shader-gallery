///////////////////////////////////////////////////////////////////////////////
// advanced chessboard pattern with lens distortion
///////////////////////////////////////////////////////////////////////////////

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

////////////////////////////////////////////////////////////
// global variables, from outside of shader
////////////////////////////////////////////////////////////
uniform float time; // not in use
uniform vec2 mouse; // not in use
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D lastFrame;

float whatever = mod(time*1e-4+dot(surfaceSize,surfaceSize),2.0) - 1.0;
//#define time (whatever)

////////////////////////////////////////////////////////////
// lens distortion coefficients ...
////////////////////////////////////////////////////////////

// values from: http://alumni.media.mit.edu/~sbeck/results/Distortion/distortion.html
float k1 = 1.105763E-01 + cos(time);
float k2 = 1.886214E-01 ;
float k3 = 1.473832E-01 ;

float p1 = -8.448460E-02 * cos(time);
float p2 = -7.356744E-02 * sin(time);

float block = abs(32.0*(2.0+cos(time-1.0/16.0)));

#define SHOW_COLOR 1


float fn(float f)
{
	vec2 m = mouse * 2.0 - 1.0;
	float ma = m.x * m.y;
	float t = time + time*m.y/m.x-ma;
	float ft = fract(t);
	
	//if ( ft > 0.5 ) return 1.0-ft/f;
	
	float s = smoothstep(1.0,-1.0,f);
	
	
	
	return floor( s+floor(f+t) );
}

////////////////////////////////////////////////////////////
// determine color
////////////////////////////////////////////////////////////
vec3 GetChessboardColor(vec2 pos)
{
	vec3 color = (vec3(pos, 0.));
	
	float block_idx_i = fn(resolution.x * pos.x / block);
	float block_idx_j = fn(resolution.y * pos.y / block);
	
	////////////////////////////////////////
	// "black" part
	////////////////////////////////////////
	
	float iv = dot(pos,pos);
	
	pos *= iv;
		
	if (	(mod(block_idx_i, 2.) == 0. && mod(block_idx_j, 2.) == 1.) ||
		(mod(block_idx_i, 2.) == 1. && mod(block_idx_j, 2.) == 0.) )
	{
		//color = vec3(pos,iv);
	}
	
	////////////////////////////////////////
	// "white" part - colored in two ways
	////////////////////////////////////////
	else {
		// simple white for chessboard
		color = vec3(1., 1., 1.);

		// advanced chess board pattern
#if SHOW_COLOR
		// red and green: show the pixel location
		float r = pos.x + 0.5;
		float g = pos.y + 0.5;
		
		// blue: show chessboard structure
		float b = 1.0;
		
		// pattern 1 : 
		if ( (mod(block_idx_i, 2.) == 0. &&
		      mod(block_idx_j, 2.) == 0.) )
		{
			b = 0.;
		}
		// pattern 2: inverted color (not in use)
		else
		{
			r = 1.-r;
			g = 1.-g;
		}

		color = vec3(r,g,b);
#endif
	}
	
#if 0
	// out of range: GRAY
	if (pos.x < -0.5 || 0.5 < pos.x ||
	    pos.y < -0.5 || 0.5 < pos.y )
	{
		color.r = 0.75;
		color.g = 0.75;
		color.b = 0.75;
	}
#endif
		
	return color;
}

vec2 distort(vec2 pos_normalized)
{
	// pinhole camera assumption - image center
	vec2 r_ = pos_normalized;
	float r = dot(r_, r_);

	float x = pos_normalized.x;
	float y = pos_normalized.y;
	
	// 5-th order lens distortion model
	float r2 = r * r;
	float r4 = r2*r2;
	float r6 = r2*r4;
	float x2 = x * x;
	float y2 = y * y;
	float xy = x * y;
	
	float K = k1 * r2 + k2 * r4 + k3 * r6;
	
	x += x * K + p2 * (r2 + 2. * x2) + 2. * p1 * xy;
	y += y * K + p1 * (r2 + 2. * y2) + 2. * p2 * xy;
	
	return vec2(x,y);
}

//uniform float time;

vec2 undistort(vec2 pos_normalized)
{
	//float t = fract(time);
	// pinhole camera assumption - image center
	vec2 r_ = pos_normalized;
	float r = dot(r_, r_);
	
	//pos_normalized /= r_.yx / r;

	float x = pos_normalized.x;
	float y = pos_normalized.y;
	
	// 5-th order lens distortion model
	float r2 = r * r;
	float r4 = r2*r2;
	float r6 = r2*r4;
	float x2 = x * x;
	float y2 = y * y;
	float xy = x * y;
	
	// Based on this opinion (NOT SURE): https://stackoverflow.com/a/41495451
	float K = -k1 * r2 -k2 * r4 -k3 * r6;
	
	x += x * K - p2 * (r2 + 2. * x2) - 2. * p1 * xy;
	y += y * K - p1 * (r2 + 2. * y2) - 2. * p2 * xy;
	
	return vec2(x,y);
}

///////////////////////////////////////////////////////////////////////////////
// shader main routine
///////////////////////////////////////////////////////////////////////////////
void main( void ) {
	// gl_FragCoord.xy : in GL coordinate (LEFT BOTTOM is origin)
	// specify pixel: ( [0,resolution.x-1], [0,resolution.y-1] )

	vec2 r = resolution;
	vec2 g = gl_FragCoord.xy;
	vec2 ss = surfaceSize*r;
	vec2 s = surfacePosition;//mod(surfacePosition/ss,1.0);// - g*(ss/r);
	
	//s /= dot(s,s);
	
	// convert to WINDOW coordinate (LEFT TOP is origin)
	vec2 pos = s;//vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
	vec2 pos_normalized = pos;// vec2(pos.x / resolution.x, pos.y / resolution.y);
	//pos_normalized -= vec2(0.5, 0.5); // [+0.0:+1.0] -> [-0.5:+0.5]
	//pos_normalized *= 1.05; // slightly larger than the original image area to certificate lens distortion on boundary
	
	pos_normalized = surfacePosition;
	
	vec2 a = distort(pos_normalized);
	vec2 b = undistort(pos_normalized);
	vec2 pos_distorted = a-b;//mix(a,b,length(a-b)); // for debug
	
	vec3 color = GetChessboardColor(pos_distorted);
	
	vec4 last = texture2D(lastFrame,gl_FragCoord.xy);
	
	vec3 nextcolor = color;//fract( last.xyz + (color-last.xyz) * .05 );
	
	gl_FragColor = vec4( nextcolor, 1. );
	
	// out of range: DARK GRAY
	if (pos_normalized.x < -0.5 || 0.5 < pos_normalized.x ||
	    pos_normalized.y < -0.5 || 0.5 < pos_normalized.y )
	{
		//gl_FragColor = vec4( 1.0, 0.0, 0.0, 1. );
	}
}
