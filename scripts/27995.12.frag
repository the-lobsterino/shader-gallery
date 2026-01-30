precision highp float;

    #define LINEAR_DENSITY 1  // 0: constant
    #define H   .005           // skin layer thickness (for linear density)
    #define ANIM true         // true/false
    #define PI 3.14159

    //varying vec2 uv;
    uniform vec2 resolution;
    uniform float time;

    vec4 skyColor = vec4(1,1,1,0.1);
    vec3 sunColor = 4.*vec3(1.,.7,.1);   // NB: is Energy

    // --- noise functions from https://www.shadertoy.com/view/XslGRr
    // Created by inigo quilez - iq/2013
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

    mat3 m = mat3( 0.00,  0.80,  0.60,
                  -0.80,  0.36, -0.48,
                  -0.60, -0.48,  0.64 );

    float hash( float n )
    {
        return fract(sin(n)*43758.5453);
    }

    float density () {
	if (time > 10.0) {
	  return 1.0;
	} else {
	  return 2.0 * time / 10.0;
	}
    }

    float radius() {
	    if (time > 10.0) {
		    return 1.0;
	} else {
		    return time / 10.0;
	    }
	//return mix(.01, .9, time);//.01;
    }

    float noise( in vec3 x )
    {
        vec3 p = floor(x);
        vec3 f = fract(x);

        f = f*f*(3.0-2.0*f);

        float n = p.x + p.y*57.0 + 113.0*p.z;

        float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                            mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                        mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                            mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
        return res;
    }

    float fbm( vec3 p )
    {
        float f;
        f  = 0.5000*noise( p ); p = m*p*2.02;
        f += 0.2500*noise( p ); p = m*p*2.03;
        f += 0.1250*noise( p ); p = m*p*2.01;
        f += 0.0625*noise( p );
        return f;
    }
    // --- End of: Created by inigo quilez --------------------

    vec3 noise3( vec3 p )
    {
    	if (ANIM) p += time;
        float fx = noise(p);
        float fy = noise(p+vec3(1345.67,0,45.67));
        float fz = noise(p+vec3(0,4567.8,-123.4));
        return vec3(fx,fy,fz);
    }
    vec3 fbm3( vec3 p )
    {
    	if (ANIM) p += time;
        float fx = fbm(p);
        float fy = fbm(p+vec3(1345.67,0,45.67));
        float fz = fbm(p+vec3(0,4567.8,-123.4));
    return vec3(fx,fy,fz);
    }
    vec3 perturb3(vec3 p, float scaleX, float scaleI)
    {
        scaleX *= 2.;
    	return scaleI*scaleX*fbm3(p/scaleX); // usually, to be added to p
    }

    float constantDensityTransmittance(float NDotL,float NDotO)
    {
        return NDotL/(density()*(NDotL+NDotO));
    }

    float linearDensityTransmittance(float NDotL,float NDotO)
    {
       // if (FragCoord.y/uv.y>.42)
    		return sqrt(PI/2.) / sqrt(density()/H) ; // test1
    	//else
         // return .15*DENS*NDotL/(NDotL+NDotO)*sqrt(1.-LDotO*LDotO);       // test2
    	//	return .15*DENS*NDotL/(NDotL+NDotO);                            // test3
    }

    float Rz=0.;  // 1/2 ray length inside object
    vec4 intersectSphere(vec3 rpos, vec3 rdir)
    {
        vec3 op = vec3(0.0, 0.0, 0.0) - rpos;
        //float rad = 0.3;

        float eps = 1e-5;
        float b = dot(op, rdir);
        float det = b*b - dot(op, op) + radius()*radius();

        if (det > 0.0)
        {
            det = sqrt(det);
            float t = b - det;
            if (t > eps)
            {
                vec4 P = vec4(normalize(rpos+rdir*t), t);
                Rz = radius()*P.z;   // 1/2 ray length inside object
    #if LINEAR_DENSITY
                // skin layer counts less
                float dH = 1.+H*(H-2.*radius())/(Rz*Rz);
                if (dH>0.) // core region
                    Rz *= .5*(1.+sqrt(dH));
                else
                    Rz *= .5*radius()*(1.-sqrt(1.-Rz*Rz/(radius()*radius())))/H;
    #endif
                return P;
            }
        }

        return vec4(0.0);
    }

    bool computeNormal(in vec3 cameraPos, in vec3 cameraDir, out vec3 normal)
    {
        cameraPos = cameraPos+perturb3(cameraDir,.06,1.5);
        vec4 intersect = intersectSphere(cameraPos,cameraDir);
        if ( intersect.w > 0.)
        {
            normal = intersect.xyz;
            //normal = normalize(normal+perturb3(normal,.3,30.));
            return true;
        }
        return false;
    }
    float computeTransmittance( in vec3 cameraPos, in vec3 cameraDir )
    {
        vec3 normal;
        if ( computeNormal(cameraPos,cameraDir,normal))
        {
            float NDotL = 0.;//clamp(normal, 0.,1.);
            float NDotO = 1.;//clamp(normal, 0.,1.);
           // float LDotO = clamp(lightDir,0.,1.);

    #if LINEAR_DENSITY
            float transmittance = linearDensityTransmittance(NDotL,NDotO)*.5;
    #else
            float transmittance = constantDensityTransmittance(NDotL,NDotO);
    #endif
            return transmittance;
        }

        return -1.;
    }

    void main(void)
    {
      vec4 fragCoord = gl_FragCoord;
      vec4 fragColor;
     
      //   //camera
      vec3 cameraPos = vec3(0.0,0.0,1.0);
      vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
      vec3 ww = normalize( cameraPos - cameraTarget );
      vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
      vec3 vv = normalize(cross(ww,uu));
      vec2 q = fragCoord.xy / resolution.xy;
      vec2 p = -1.0 + 2.0*q;
      p.x *= resolution.x/ resolution.y;
      vec3 cameraDir = normalize( p.x*uu + p.y*vv - 1.5*ww );


        //light
        //float theta = (resolution.x *2. - 1.)*PI;
        //float phi = (resolution.y - .5)*PI;
        //vec3 lightDir =vec3(sin(theta)*cos(phi),sin(phi),cos(theta)*cos(phi));

    	// shade object
        float transmittance = computeTransmittance( cameraPos, cameraDir);


        // display: object
    		Rz = 1.-exp(-8.*density()*Rz);
    	  float alpha = Rz;
        //gl_FragColor = vec4(alpha); return; // for tests
        vec3 frag = vec3(transmittance,transmittance,transmittance);
       	fragColor = (1.-alpha)*skyColor;
    	
        gl_FragColor = fragColor;
    }