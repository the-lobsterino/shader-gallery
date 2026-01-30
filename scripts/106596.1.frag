#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 vUv;

 mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
    mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
    float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
    vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

    float triNoise2d(in vec2 p, float spd)
    {
        float z=1.8;
        float z2=2.5;
        float rz = 0.;
        p *= mm2(p.x*0.06);
        vec2 bp = p;
        for (float i=0.; i<5.; i++ )
        {
            vec2 dg = tri2(bp*1.85)*.75;
            dg *= mm2(time*spd);
            p -= dg/z2;

            bp *= 1.3;
            z2 *= .45;
            z *= .42;
            p *= 1.21 + (rz-1.0)*.02;
            
            rz += tri(p.x+tri(p.y))*z;
            p*= -m2;
        }
        return clamp(1./pow(rz*29., 1.3),0.,.55);
    }

    float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

void main( void ) {

	float noise = triNoise2d(vec2(10.0,10.0) * 10.0, 0.06); // Adjust the multiplier to zoom in/out the noise
    	gl_FragColor = vec4(vec3(noise), 1.0);

}