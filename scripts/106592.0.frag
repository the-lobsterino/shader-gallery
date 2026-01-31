#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265358979323846
#define saturate(t) clamp(t, 0.0, 1.0)
        
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

        const vec3 seaBaseColor = vec3(0.1, 0.2, 0.36);
        const vec3 seaColor = vec3(0.25, 0.4, 0.15);
	const float baseColorStrength = 0.85;
        const float seaColorStrength = 0.15;
        const float shininess = 0.27;
        
        vec4 wave(vec2 pos, vec2 dir, float freq, float stime) {
            float t = dot(dir, pos) * freq + stime;
            float r = exp(sin(t) - 1.0);
            float d = r * cos(t);
            return vec4(r, d * dir, d);
        }
        vec4 getWaterValue(vec2 pos) {
            vec2 r, p, d;
            float freq = 1.0;
            float w = 1.0;
            float vResult, vWeight, iter;
            for(int i = 0; i < 24; i++) {
                vec2 p = vec2(cos(iter), sin(iter));
                vec4 r = wave(pos, p, freq, time * 2.0);
                pos += p * -r.w * w * 0.7;
    
                d += r.yz * w * freq;
                vResult += r.x * w;
                vWeight += w;
                w *= 0.82;
                freq *= 1.18;
    
                iter += 1232.399963;
            }
            return vec4(vResult / vWeight, normalize(vec3(-d.x, vWeight, -d.y)));
        }

        vec3 getSunDir() {
            return normalize(vec3(sin(time * 0.05), 1.0, cos(time * 0.05)));
        }

        //距離関数たち
        //空の色を出す
        //上になればなるほど青く
        vec3 getSkyColor(vec3 p, vec3 l) {
            //微調整
            p.y += 0.1;
            float r = pow(1.0 - p.y, 2.0);
            float g = 1.0 - p.y;
            float b = clamp(0.3 + (1.0 - p.y) * 0.7, 0.5, 1.0);
            p.y -= 0.105;
            float sun = saturate(pow(max(0.0, dot(p, l)), 800.0) * 210.0);
            return vec3(r, g, b) + sun;
        }
        
        void main(void) {
            vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
            vec2 m = vec2(mouse * 2.0 - 1.0);
            m.y *= -1.0;
    
    
            vec3 cPos = vec3(16.0, 2.0, 16.0);
            vec3 cDir = normalize(vec3(cos(m.x) * cos(m.y), sin(m.y), sin(m.x) * cos(m.y)));
            vec3 cSide = normalize(cross(cDir, vec3(0.0, 1.0, 0.0)));
            vec3 cUp = normalize(cross(cSide, cDir));

            vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);
            
            vec3 lightDir = getSunDir();
            vec3 color;

                color = getSkyColor(ray, lightDir);
            float dist, l, rayLength;
            vec3 rPos = cPos;
            vec4 seaData;
            
            for(int i = 0; i < 48; i++) {
                rPos = cPos + ray * dist;
                seaData = getWaterValue(rPos.xz);
                dist += rPos.y - seaData.x;
                l = length(cPos - rPos);
                if(rPos.y < seaData.x + 0.01 || l > 40.0) {
                    break;
                }
            }
            if(l < 40.0) {
                vec3 normal = seaData.yzw;
                float diff = saturate(dot(lightDir, normal));
                float seaHeight = rPos.y - seaData.x;
                float r = 0.02;
                float facing = saturate(1.0 - dot(normal, -ray));
                float fresnel = r + (1.0 - r) * pow(facing, 5.0);
                vec3 reflectDir = reflect(ray, normal);
                
                vec3 seaBase = seaBaseColor * diff * baseColorStrength + mix(seaBaseColor, seaColor * seaColorStrength, diff);
                vec3 seaReflect = getSkyColor(reflectDir, lightDir);
                vec3 seaWater = mix(seaBase, seaReflect, fresnel);
                float dotSpec = saturate(dot(reflectDir, lightDir) * 0.5 + 0.5);
                float specular = (1.0 - fresnel) * saturate(lightDir.y) * pow(dotSpec, 256.0) * (shininess * 1.8 + 0.2);
                specular += specular * 25.0 * saturate(shininess - 0.05);
                
                color = seaWater + seaColor * (seaHeight * 0.5 + 0.2) * 0.05 + specular;
                
                float fog = exp(-0.001 * pow(l, 2.0));
                color *= fog;
                color += 1.0 - fog;
            }        
            gl_FragColor = vec4(color, 1.0);
        }