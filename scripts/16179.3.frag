#ifdef GL_ES
precision mediump float;
#endif 

// Kabutos 2nd Revision 2014 live coding entry
// WebGL remix (modified a bit to make up for the lack of predefined textures and music FFT data)


uniform float time; // in seconds
uniform vec2 resolution; // viewport resolution
uniform sampler2D backbuffer;


float iFFT0 = cos(time)*.2;
float iFFT1 = cos(time*2.)*.2;
float iFFT2 = cos(time*3.)*.2;
float iFFT3 = cos(time*4.)*.2;


float noise(vec2 vec) {
	return sin(vec.x*4.1)*sin(vec.y*4.2)*.2+sin(vec.x*5.4)*sin(vec.y*5.5)*.1+.4;
}

vec2 path(float z) {
	return vec2(sin(z*.03)*7.,cos(z*.03)*7.-4.);
}

void main(void)
{
	vec2 uv = vec2( gl_FragCoord.xy -resolution*.5) / resolution.x;

	float z = time*10.+iFFT0*5.;
	vec3 pos=vec3(path(z),z);
	vec2 posd = (path(z+10.)-path(z))/10.;

	vec3 dir=normalize(vec3(uv,1));

	float a=posd.y*.4-.2;

	dir*=mat3(1,0,0,0,cos(a),sin(a),0,-sin(a),cos(a));



	vec3 vox=floor(pos);





	vec3 norm,hit;

	float bright;



	



	vec3 color=vec3(0);



	for(int i=0;i<150;i++){
		// This is a simple voxel marcher
		
		// Compute distance vector between camera and current voxel
		vec3 dist=vox-pos+step(vec3(0),dir);

		// Dividing by mx yields which of the adjacent voxels to test next (the direction that's got the smallest value at that moment)
		vec3 mx=dist/dir;

		// Compute normal of the voxel surface we just crossed (yields vec3(1,0,0) or vec3(0,1,0) or vec3(0,0,1) except for corner cases which don't really matter here though)
		norm = step(mx,vec3(min(min(mx.x,mx.y),mx.z)));

		// Now go to next voxel in that direction
		vox += norm*sign(dir);

		// Compute the actual hit point
		hit=pos+dot(norm,mx)*dir;

		// Density: if < 0 then abort to draw the voxel in question, otherwise continue looping
		vec3 d=vox*.7;
		float dens=max(d.y*.5+noise(d.xz*.1+iFFT0)*10.+.3,3.-length(vox.xy-path(vox.z)));
		
		if (dens<0.)break;

		// Brightness: the further away the dimmer (so voxels slowly appear=
		bright=(149.-float(i))/150.;

		// For 
		float dens2=hit.y*.5+noise(hit.xz*.1+iFFT0)*6.+.3;

		color += dot(.5-abs(fract(hit)-.5),vec3(1))*.06/dens+vec3(-1,-1,1)*step(fract(dens2),.004)*step(fract(dens),.1)*10.;

	}

	vec4 t = texture2D(backbuffer,fract(-hit.xy))*norm.z+texture2D(backbuffer,fract(-hit.xz))*norm.y+3.;
	gl_FragColor = vec4((t*bright+(color.xyzz-6.+vec4(iFFT1,iFFT2,iFFT3,0)*8.4)*.4).xyz,1);
}