import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useAuth} from '../hooks/use_auth';
import styles from './Settings.module.css';
import {useMutation, useQuery} from '@apollo/client';
import {
  mutation_changePassword,
  mutation_changeProfilePic,
  mutation_deleteProfilePic,
  mutation_editProfile,
} from '../graphql/mutations/user';
import {query_current_user} from '../graphql/queries/user';
import {changePasswordRules, editProfileRules} from '../rules/rules';
import ProfilePic from '../components/ProfilePic';
import CustomLoader from '../components/CustomLoader';
import {getCurrentUser} from '../utils';
