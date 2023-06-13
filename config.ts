import { Condition, KarabinerComplexModifications, Key, KeyPressFrom, KeyPressTo, Manipulator } from './lib/karabiner.ts';

const CHAR_keys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'hyphen',
    'equal_sign',
    'grave_accent_and_tilde',
    'comma',
    'period',
    'slash',
    'spacebar',
    'non_us_backslash',
    'open_bracket',
    'close_bracket',
    'backslash',
    'semicolon',
    'quote',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
] as Key[]
const FN_keys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10','f11', 'f12' ] as Key[]

const AppleKeyboard_identifiers = [{ 'vendor_id': 1452 }];
const RDP_or_VM_bundle_identifiers = [
    '^com.microsoft.rdc$',
    '^com.microsoft.rdc.mac$',
    '^com.microsoft.rdc.macos$',
    '^com.microsoft.rdc.osx.beta$',
    '^com.vmware.fusion$',
    '^com.vmware.horizon$',
    '^com.vmware.view$',
    '^com.parallels.desktop$',
    '^com.parallels.vm$',
    '^com.parallels.desktop.console$',
    '^org.virtualbox.app.VirtualBoxVM$',
    '^com.vmware.proxyApp.',
    '^com.parallels.winapp.',
    '^com.2X.Client.Mac$',
    '^com.realvnc.vncviewer'
];

const overMacApps = { type: 'frontmost_application_unless', bundle_identifiers: RDP_or_VM_bundle_identifiers } as Condition;
const overWinApps = { type: 'frontmost_application_if', bundle_identifiers: RDP_or_VM_bundle_identifiers } as Condition;
const usingMacKBs = { type: 'device_if', identifiers: AppleKeyboard_identifiers } as Condition;
const usingWinKBs = { type: 'device_unless', identifiers: AppleKeyboard_identifiers } as Condition;

function genHotkeyTo(from: KeyPressFrom, to: KeyPressTo, conditions = [] as Condition[]): Manipulator {
    return { type: 'basic', from: from, to: [ to ], conditions: conditions }
}

const complexMods = new KarabinerComplexModifications();

// [win-like] apple kb mac app (Fn>LCmd, LCtrl>Fn, extra)
// [win-like] apple kb win app (Fn>LCtrl, LCtrl>Fn, LAlt>Win, LCmd>LAlt, RCmd>RAlt, RAlt>RCtrl)
// [win-like] us kb mac app (lCtrl>rCmd, extra)
// [macbook] RAlt Extra
//  ← ↑ → ↓

complexMods.addRule({
    description: '[win-like] apple kb (LCmd>Fn, Fn>LCtrl, extra) on VM/RDP (LCtrl><Fn, LAlt><LCmd, RCmd>RAlt, RAlt>RCtrl)',
    manipulators: (() => {
        const mList = [] as Manipulator[];

        // REMAP FOR CHAR_keys
        CHAR_keys.forEach(keyCode => {
            // --- MAC KEYBOARD (fn ctrl alt cmd space cmd alt)
            // Lcmd TO fn (only over win apps)
            mList.push( genHotkeyTo({ key_code: keyCode, modifiers: { mandatory: ['fn'], optional: ['any'] } }, { key_code: keyCode, modifiers: [ 'left_command' ] }, [ usingMacKBs, overMacApps ]) );
            // Lctrl TO fn (only over win apps)
            mList.push( genHotkeyTo({ key_code: keyCode, modifiers: { mandatory: ['fn'], optional: ['any'] } }, { key_code: keyCode, modifiers: [ 'left_control' ] }, [ usingMacKBs, overWinApps ]) );
            
            // --- WIN KEYBOARD (ctrl [fn] win alt space alt [win] ctrl)
            // cmd TO ctrl (mac apps)
            mList.push( genHotkeyTo({ key_code: keyCode, modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: keyCode, modifiers: [ 'left_command' ] }, [ usingWinKBs, overMacApps ]) );
            mList.push( genHotkeyTo({ key_code: keyCode, modifiers: { mandatory: ['right_control'], optional: ['any'] } }, { key_code: keyCode, modifiers: [ 'right_command' ] }, [ usingWinKBs, overMacApps ]) );
            // usually nothing needed (win apps)
            // ...
        });

        // FOR F1-F12
        // fn TO LCtrl
        mList.push( genHotkeyTo({ key_code: 'f1',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'display_brightness_decrement' }, [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f2',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'display_brightness_increment' }, [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f3',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'mission_control' },              [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f4',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'launchpad' },                    [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f5',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'illumination_decrement' },       [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f6',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'illumination_increment' },       [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f7',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'rewind' },                       [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f8',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'play_or_pause' },                [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f9',  modifiers: { mandatory: ['left_control'] } }, { key_code: 'fastforward' },                  [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f10', modifiers: { mandatory: ['left_control'] } }, { key_code: 'mute' },                         [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f11', modifiers: { mandatory: ['left_control'] } }, { key_code: 'volume_decrement' },             [ usingMacKBs, overMacApps ]) );
        mList.push( genHotkeyTo({ key_code: 'f12', modifiers: { mandatory: ['left_control'] } }, { key_code: 'volume_increment' },             [ usingMacKBs, overMacApps ]) );
        // fn TO RAlt 
        mList.push( genHotkeyTo({ key_code: 'f7',  modifiers: { mandatory: ['right_alt'] } }, { key_code: 'rewind' },           [ usingMacKBs ]) );
        mList.push( genHotkeyTo({ key_code: 'f8',  modifiers: { mandatory: ['right_alt'] } }, { key_code: 'play_or_pause' },    [ usingMacKBs ]) );
        mList.push( genHotkeyTo({ key_code: 'f9',  modifiers: { mandatory: ['right_alt'] } }, { key_code: 'fastforward' },      [ usingMacKBs ]) );
        mList.push( genHotkeyTo({ key_code: 'f10', modifiers: { mandatory: ['right_alt'] } }, { key_code: 'mute' },             [ usingMacKBs ]) );
        mList.push( genHotkeyTo({ key_code: 'f11', modifiers: { mandatory: ['right_alt'] } }, { key_code: 'volume_decrement' }, [ usingMacKBs ]) ); 
        mList.push( genHotkeyTo({ key_code: 'f12', modifiers: { mandatory: ['right_alt'] } }, { key_code: 'volume_increment' }, [ usingMacKBs ]) );
        // LCtrl to fn
        FN_keys.forEach(keyCode => {
            mList.push( genHotkeyTo({ key_code: keyCode, modifiers: { mandatory: ['fn'], optional: ['any'] } }, { key_code: keyCode, modifiers: [ 'left_control' ] }, [ usingMacKBs, overMacApps ]) )
        })

        // win-like ctrl + ← → behaviour on fn + ← →
        mList.push( genHotkeyTo({ key_code: 'left_arrow',  modifiers: { mandatory: ['fn'],           optional: ['any'] } }, { key_code: 'left_arrow',  modifiers: [ 'left_alt' ] }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'right_arrow', modifiers: { mandatory: ['fn'],           optional: ['any'] } }, { key_code: 'right_arrow', modifiers: [ 'left_alt' ] }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'left_arrow',  modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'left_arrow',  modifiers: [ 'left_alt' ] }, [ usingWinKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'right_arrow', modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'right_arrow', modifiers: [ 'left_alt' ] }, [ usingWinKBs, overMacApps ]) )
        
        // ctrl + tab TO fn + tab
        mList.push( genHotkeyTo({ key_code: 'tab', modifiers: { mandatory: ['fn'], optional: ['any'] } }, { key_code: 'tab', modifiers: [ 'left_control' ] }, [ usingMacKBs, overMacApps ]) )
        
        // RDP, Virtual Machines (alt > win, cmd > alt) and fn <> ctrl for apple keyboards
        mList.push( genHotkeyTo({ key_code: 'fn',            modifiers: { optional: ['any'] } }, { key_code: 'left_control'  }, [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'left_control',  modifiers: { optional: ['any'] } }, { key_code: 'fn'            }, [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'left_alt',      modifiers: { optional: ['any'] } }, { key_code: 'left_command'  }, [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'left_command',  modifiers: { optional: ['any'] } }, { key_code: 'left_alt'      }, [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'right_command', modifiers: { optional: ['any'] } }, { key_code: 'right_alt'     }, [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'right_alt',     modifiers: { optional: ['any'] } }, { key_code: 'right_control' }, [ usingMacKBs, overWinApps ]) )

        // [win-like] us kb (lCtrl>rCmd, extra)
        mList.push( genHotkeyTo({ key_code: 'right_arrow', modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'end'       }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'left_arrow',  modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'home'      }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'up_arrow',    modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'page_up'   }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'down_arrow',  modifiers: { mandatory: ['left_control'], optional: ['any'] } }, { key_code: 'page_down' }, [ usingMacKBs, overMacApps ]) )

        return  mList
    })()
})

complexMods.addRule({
    description: 'RShift + Backspace = Delete (word with fn) for apple keyboard',    
    manipulators: (() => {
        const mList = [] as Manipulator[];
        
        mList.push( genHotkeyTo({ key_code: 'delete_or_backspace', modifiers: { mandatory: ['fn', 'right_shift'], optional: [ 'any' ] } }, { key_code: 'delete_forward',      modifiers: [ 'left_option' ] }, [ usingMacKBs, overMacApps ]) )
        mList.push( genHotkeyTo({ key_code: 'delete_or_backspace', modifiers: { mandatory: ['fn', 'right_shift'], optional: [ 'any' ] } }, { key_code: 'delete_forward',      modifiers: [ 'left_control' ] },  [ usingMacKBs, overWinApps ]) )
        mList.push( genHotkeyTo({ key_code: 'delete_or_backspace', modifiers: { mandatory: ['fn'               ], optional: [ 'any' ] } }, { key_code: 'delete_or_backspace', modifiers: [ 'left_option' ] }, [ usingMacKBs ] ) )
        mList.push( genHotkeyTo({ key_code: 'delete_or_backspace', modifiers: { mandatory: ['right_shift'      ], optional: [ 'any' ] } }, { key_code: 'delete_forward',      modifiers: [ ] }, [ usingMacKBs ] ) )
        
        return mList
    })()
})

complexMods.addRule({
    description: 'RShift + Enter = Insert for apple keyboard',
    manipulators: (() => {
        const mList = [] as Manipulator[];

        mList.push( genHotkeyTo({ key_code: 'return_or_enter', modifiers: { mandatory: ['right_shift'], optional: [ 'any' ] } }, { key_code: 'insert' }, [ usingMacKBs ]) )
        
        return mList
    })()
})

complexMods.addRule({
    description: `NUMPAD SIMUL: RAlt + k,./l;'op[ = keypad_0-9 [9]>[/] [0]>[*] ']'>[.]`,
    manipulators: (() => {
        const mList = [] as Manipulator[];

        mList.push( genHotkeyTo({ key_code: 'comma',         modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_1'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'period',        modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_2'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'slash',         modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_3'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'k',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_0'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'l',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_4'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'semicolon',     modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_5'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'quote',         modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_6'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'o',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_7'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'p',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_8'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: '9',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_slash'    }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: '0',             modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_asterisk' }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'open_bracket',  modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_9'        }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'close_bracket', modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_period'   }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'hyphen',        modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_hyphen'   }, [ usingMacKBs ]) )
        mList.push( genHotkeyTo({ key_code: 'equal_sign',    modifiers: { mandatory: ['right_alt'] } }, { key_code: 'keypad_plus'     }, [ usingMacKBs ]) )
        
        return mList
    })()
})

complexMods.writeToProfile('Default profile');





